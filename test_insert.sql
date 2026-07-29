INSERT INTO file_module_links (file_id, module_name) VALUES ('TEST-FILE-001', 'Water Footprint');
INSERT INTO file_module_links (file_id, module_name) VALUES ('TEST-FILE-002', 'Carbon Footprint');
SELECT COUNT(*) as total FROM file_module_links;
SELECT * FROM file_module_links WHERE module_name = 'Water Footprint';
