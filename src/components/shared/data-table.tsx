import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => ReactNode
  width?: string
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField?: keyof T | string
  className?: string
  onRowClick?: (row: T) => void
}

export default function DataTable<T>({
  columns,
  data,
  keyField = 'id',
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      <table className="w-full">
        <thead className="bg-muted border-b border-border sticky top-0">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  'px-6 py-3 text-left text-sm font-semibold text-foreground',
                  col.width || 'auto'
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={(row[keyField as keyof T] as string) || rowIdx}
                className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm text-foreground">
                    {col.render ? col.render((row[col.key as keyof T] as any), row) : (row[col.key as keyof T] as any)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
