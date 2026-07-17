import type { BudgetItem } from '@buttercup/shared/types';

interface BudgetTableProps {
  items: BudgetItem[];
}

export function BudgetTable({ items }: BudgetTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-slate-200 text-slate-500">
        <tr>
          <th className="py-2">Category</th>
          <th className="py-2">Planned</th>
          <th className="py-2">Actual</th>
          <th className="py-2">Difference</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const difference = item.planned - item.actual;
          return (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-2 font-medium text-slate-800">{item.category}</td>
              <td className="py-2 text-slate-600">${item.planned.toLocaleString()}</td>
              <td className="py-2 text-slate-600">${item.actual.toLocaleString()}</td>
              <td className={`py-2 ${difference < 0 ? 'text-red-600' : 'text-green-700'}`}>
                {difference < 0 ? '-' : ''}${Math.abs(difference).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
