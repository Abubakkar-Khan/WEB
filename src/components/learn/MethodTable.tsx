import React from 'react';

interface MethodTableProps {
  headers: string[];
  rows: React.ReactNode[][];
}

export const MethodTable: React.FC<MethodTableProps> = ({ headers, rows }) => (
  <div className="nt-table-wrapper">
    <table className="nt-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th className="nt-th" key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td className="nt-td" key={`${rowIndex}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
