import { useState, useEffect } from 'react';
import { FileText, Loader, AlertCircle } from 'lucide-react';

interface LinkedFile {
  file_id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_date: string;
}

interface LinkedFilesSectionProps {
  moduleName: string;
}

export default function LinkedFilesSection({ moduleName }: LinkedFilesSectionProps) {
  const [linkedFiles, setLinkedFiles] = useState<LinkedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinkedFiles();
  }, [moduleName]);

  const fetchLinkedFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/module-linking/linked-files/${moduleName}`);
      const data = await response.json();
      setLinkedFiles(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load linked files');
      setLinkedFiles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <Loader size={18} className="animate-spin text-blue-600" />
          <span className="text-blue-600">Loading connected files...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-red-600" />
          <span className="text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  if (linkedFiles.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <p className="text-gray-600 text-sm">No files connected to this module yet. Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText size={20} className="text-blue-600" />
        📂 Connected Data Files
      </h3>

      <div className="space-y-3">
        {linkedFiles.map((file: LinkedFile, idx: number) => (
          <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {file.filename || `File ${idx + 1}`}
                </h4>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="text-gray-500">Type:</span> {file.file_type || 'unknown'}
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span> {file.file_size ? `${(file.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Uploaded:</span> {file.upload_date ? new Date(file.upload_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => loadFileData(file.file_id, moduleName)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                🔄 Load Data
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded text-sm text-blue-800">
        <strong>💡 Tip:</strong> Click "Load Data" to auto-fill the calculator inputs with values from your uploaded files.
      </div>
    </div>
  );
}

function loadFileData(fileId: string, moduleName: string) {
  try {
    fetch(
      `http://localhost:5000/api/module-linking/file-analysis/${fileId}/${moduleName}`
    ).then(response => response.json()).then(data => {
      console.log('File data loaded:', data);
      window.dispatchEvent(new CustomEvent('fileDataLoaded', { detail: data }));
    });
  } catch (err) {
    console.error('Failed to load file data:', err);
    alert('Failed to load file data. Try again.');
  }
}
