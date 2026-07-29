import express from 'express';
import pool from '../db.js';

const router = express.Router();

export async function initModuleLinkingTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS file_module_links (
        id SERIAL PRIMARY KEY,
        file_id VARCHAR(255),
        module_name VARCHAR(255),
        module_path VARCHAR(255),
        data_mapping JSONB DEFAULT '{}'::jsonb,
        auto_filled_fields JSONB DEFAULT '{}'::jsonb,
        analysis_results JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[DB] File-Module Linking table initialized');
  } catch (err) {
    console.error('[DB] Linking table error:', err.message);
  }
}

router.get('/test', (req, res) => {
  res.json({ working: true });
});

router.get('/linked-files/:module_name', async (req, res) => {
  try {
    const { module_name } = req.params;
    const result = await pool.query(
      `SELECT fml.*, uf.filename, uf.file_type, uf.file_size, uf.created_at as upload_date
       FROM file_module_links fml
       LEFT JOIN uploaded_files uf ON fml.file_id = uf.file_id
       WHERE fml.module_name = $1 
       ORDER BY fml.created_at DESC`,
      [module_name]
    );
    
    res.json(result.rows || []);
  } catch (error) {
    console.error('[Module Linking] Error fetching linked files:', error.message);
    res.json([]);
  }
});

router.get('/file-analysis/:file_id/:module_name', async (req, res) => {
  try {
    const { file_id, module_name } = req.params;

    const fileRes = await pool.query(
      `SELECT * FROM uploaded_files WHERE file_id = $1`,
      [file_id]
    );

    if (!fileRes.rows.length) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileRes.rows[0];
    const dataExtracted = typeof file.data_extracted === 'string' 
      ? JSON.parse(file.data_extracted) 
      : (file.data_extracted || {});

    const linkRes = await pool.query(
      `SELECT * FROM file_module_links WHERE file_id = $1 AND module_name = $2`,
      [file_id, module_name]
    );

    const link = linkRes.rows[0] || {};

    res.json({
      success: true,
      file: {
        id: file.file_id,
        filename: file.filename,
        file_type: file.file_type,
        file_size: file.file_size,
        upload_date: file.created_at,
      },
      analysis: {
        data_mapping: link.data_mapping || {},
        auto_filled_fields: link.auto_filled_fields || {},
        confidence: calculateConfidence(link.data_mapping || {}),
      },
      data_sample: dataExtracted.data_preview || [],
      insights: dataExtracted.insights || {},
    });
  } catch (error) {
    console.error('[File Analysis] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/link-file-to-module', async (req, res) => {
  try {
    const { file_id, module_name, module_path } = req.body;

    if (!file_id || !module_name) {
      return res.status(400).json({ error: 'file_id and module_name required' });
    }

    // Try to get file for mapping, but proceed if not found
    let data_mapping = {};
    let auto_filled_fields = {};

    try {
      const fileRes = await pool.query(
        `SELECT * FROM uploaded_files WHERE file_id = $1`,
        [file_id]
      );

      if (fileRes.rows.length > 0) {
        const file = fileRes.rows[0];
        const dataExtracted = typeof file.data_extracted === 'string'
          ? JSON.parse(file.data_extracted)
          : (file.data_extracted || {});

        data_mapping = generateMapping(module_name, file.file_type, dataExtracted);
        auto_filled_fields = extractFields(dataExtracted, data_mapping);
      }
    } catch (e) {
      console.warn('[Link] Could not extract file data:', e.message);
    }

    // Save link regardless of whether file exists
    await pool.query(
      `INSERT INTO file_module_links 
       (file_id, module_name, module_path, data_mapping, auto_filled_fields)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (file_id, module_name) DO UPDATE SET
       data_mapping = $4,
       auto_filled_fields = $5`,
      [file_id, module_name, module_path || '', JSON.stringify(data_mapping), JSON.stringify(auto_filled_fields)]
    );

    res.json({
      success: true,
      file_id,
      module_name,
      mapping: data_mapping,
      auto_filled: auto_filled_fields,
    });
  } catch (error) {
    console.error('[Link File] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/save-analysis/:file_id/:module_name', async (req, res) => {
  try {
    const { file_id, module_name } = req.params;
    const { analysis_results } = req.body;

    await pool.query(
      `UPDATE file_module_links 
       SET analysis_results = $1
       WHERE file_id = $2 AND module_name = $3`,
      [JSON.stringify(analysis_results || {}), file_id, module_name]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateMapping(moduleName, fileType, dataExtracted) {
  const mappings = {
    'Water Footprint': ['water', 'consumption', 'flow', 'usage', 'm3'],
    'Carbon Footprint': ['energy', 'emissions', 'co2', 'carbon', 'mwh'],
    'ZLD Calculator': ['wastewater', 'waste', 'flow', 'tds', 'recycled'],
    'ISO 14046': ['water', 'product', 'lifecycle', 'footprint'],
    'Water Neutrality': ['water', 'recycled', 'recharged', 'consumption', 'reuse'],
    'ESG Reporting': ['water', 'energy', 'waste', 'emissions', 'carbon'],
    'RO Design': ['wastewater', 'salinity', 'pressure', 'tds'],
    'E. coli Analysis': ['ecoli', 'bacteria', 'quality', 'mfn'],
    'Lake Management': ['lake', 'ph', 'turbidity', 'nitrogen', 'phosphorus'],
  };

  const mapping = {};

  if ((fileType === 'excel' || fileType === 'csv') && dataExtracted.headers) {
    const keywords = mappings[moduleName] || [];
    dataExtracted.headers.forEach((header) => {
      const headerLower = header.toLowerCase();
      keywords.forEach(keyword => {
        if (headerLower.includes(keyword)) {
          mapping[keyword] = header;
        }
      });
    });
  }

  return mapping;
}

function extractFields(dataExtracted, dataMapping) {
  const extracted = {};

  if (!dataExtracted.headers) return extracted;

  if (dataExtracted.data_preview && Array.isArray(dataExtracted.data_preview)) {
    const firstRow = dataExtracted.data_preview[0];
    if (firstRow) {
      Object.entries(dataMapping).forEach(([field, columnName]) => {
        const idx = dataExtracted.headers.indexOf(columnName);
        if (idx >= 0 && firstRow[idx] !== undefined) {
          extracted[field] = {
            value: firstRow[idx],
            column: columnName,
            confidence: 0.95,
          };
        }
      });
    }
  }

  return extracted;
}

function calculateConfidence(mapping) {
  const mappedCount = Object.keys(mapping).length;
  return Math.min(100, (mappedCount / 5) * 100);
}

export default router;
