import React from 'react';

interface Column {
  key: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => void;
}

export const Table: React.FC<TableProps> = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr 
              key={idx} 
              onClick={() => onRowClick?.(row)} 
              className={`${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''} transition-colors`}
            >
              {columns.map((col) => (
                <td 
                  key={col.key} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
