import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'active' | 'inactive' | 'pending' | 'completed'
  children: React.ReactNode
  className?: string
}

const statusStyles: Record<string, string> = {
  'in-stock': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'low-stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  'pending': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  )
}
