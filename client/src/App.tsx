import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './layout/AppLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { GuestsPage } from './features/guests/GuestsPage';
import { TablesPage } from './features/tables/TablesPage';
import { VendorsPage } from './features/vendors/VendorsPage';
import { TasksPage } from './features/tasks/TasksPage';
import { BudgetPage } from './features/budget/BudgetPage';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/budget" element={<BudgetPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
