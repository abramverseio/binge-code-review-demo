import type { RecentActivityItem } from '@/api/dashboardApi';
import { EmptyState } from '@/components/EmptyState';

interface RecentActivityProps {
  items: RecentActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="All quiet here for now"
        description="Completed tasks will show up here as you check things off."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="p-3 text-sm text-slate-700">
          {item.message}
        </li>
      ))}
    </ul>
  );
}
