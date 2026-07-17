import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/guests', label: 'Guests' },
  { to: '/tables', label: 'Tables' },
  { to: '/vendors', label: 'Vendors' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/budget', label: 'Budget' },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
      <div className="mb-6 px-2" title="As you wish.">
        <p className="text-lg font-semibold text-slate-900">Buttercup</p>
        <p className="text-xs text-slate-400">Wedding Planner</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-buttercup-100 text-buttercup-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
