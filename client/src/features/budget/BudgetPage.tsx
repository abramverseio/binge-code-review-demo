import { PageHeader } from '@/components/PageHeader';
import { useBudgetItems, useBudgetSummary } from './hooks/useBudget';
import { BudgetTable } from './components/BudgetTable';

export function BudgetPage() {
  const { data: items, isLoading } = useBudgetItems();
  const { data: summary } = useBudgetSummary();

  return (
    <div>
      <PageHeader title="Budget" description="Planned vs. actual wedding spend." />

      {summary && (
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Planned</p>
            <p className="text-xl font-semibold text-slate-900">${summary.totalPlanned.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Actual</p>
            <p className="text-xl font-semibold text-slate-900">${summary.totalActual.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className={`text-xl font-semibold ${summary.remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
              ${summary.remaining.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {isLoading && <p className="text-sm text-slate-500">Loading budget…</p>}

      {!isLoading && items && <BudgetTable items={items} />}
    </div>
  );
}
