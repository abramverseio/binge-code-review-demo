import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useCreateTask, useTasks, useToggleTaskCompleted } from './hooks/useTasks';
import { TaskList } from './components/TaskList';
import { TaskFormModal } from './components/TaskFormModal';

export function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const toggleCompleted = useToggleTaskCompleted();

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Wedding planning checklist."
        actions={<Button onClick={() => setModalOpen(true)}>Add Task</Button>}
      />

      {isLoading && <p className="text-sm text-slate-500">Loading tasks…</p>}

      {!isLoading && tasks && tasks.length === 0 && (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path strokeLinecap="round" d="M8 10l2 2 4-4" />
            </svg>
          }
          title="Your checklist is empty — nice and tidy!"
          description="Add your first to-do to start planning the big day."
        />
      )}

      {!isLoading && tasks && tasks.length > 0 && (
        <TaskList tasks={tasks} onToggleCompleted={(task) => toggleCompleted.mutate({ task })} />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(input) => {
          createTask.mutate({ ...input, description: '', completed: false });
          setModalOpen(false);
        }}
      />
    </div>
  );
}
