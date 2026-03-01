import { type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
}

export function AdminTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
}: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-[22px]">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-[#01adf1]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-[16px] py-[16px] text-left font-outfit text-[16px] font-bold text-[#f8f8f8] ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[#f8f8f8]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-[40px] text-center font-outfit text-[14px] text-[#5d5d5d]"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={String(row[keyField] ?? idx)}
                className="border-b border-[#ddd] last:border-0"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-[16px] py-[14px] font-outfit text-[12px] font-normal text-black ${col.className ?? ''}`}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
