import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const ExportButton = ({ data, filename, type = 'json' }) => {
  const exportToJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${filename}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = `${filename}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExport = () => {
    if (type === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleExport}
        className="btn-secondary flex items-center gap-2"
        title={`Export as ${type.toUpperCase()}`}
      >
        <Download className="h-4 w-4" />
        Export {type.toUpperCase()}
      </button>
      
      {/* Dropdown menu for export options */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          <button
            onClick={exportToJSON}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export as JSON
          </button>
          <button
            onClick={exportToCSV}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportButton;
