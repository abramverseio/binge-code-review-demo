import { PageHeader } from '@/components/PageHeader';
import { useDashboard } from './hooks/useDashboard';
import { StatCard } from './components/StatCard';
import { RecentActivity } from './components/RecentActivity';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return <p className="text-sm text-slate-500">Loading dashboard…</p>;
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Your wedding, at a glance." />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Guests" value={String(data.guestCount)} />
        <StatCard label="Attending" value={String(data.rsvpStats.attending)} tone="positive" />
        <StatCard label="Pending RSVPs" value={String(data.rsvpStats.pending)} />
        <StatCard
          label="Budget Remaining"
          value={`$${data.budgetSummary.remaining.toLocaleString()}`}
          tone={data.budgetSummary.remaining < 0 ? 'negative' : 'positive'}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Upcoming Tasks</h2>
          {data.upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing due — you&apos;ve thought of everything.</p>
          ) : (
            <ul className="space-y-2">
              {data.upcomingTasks.map((task) => (
                <li key={task.id} className="rounded-md border border-slate-200 bg-white p-3 text-sm">
                  <span className="font-medium text-slate-800">{task.title}</span>
                  <span className="ml-2 text-slate-400">due {task.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Recent Activity</h2>
          <RecentActivity items={data.recentActivity} />
        </section>
      </div>
    </div>
  );
}
