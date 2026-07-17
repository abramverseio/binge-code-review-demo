import { useState } from 'react';
import { taskCreateSchema } from '@buttercup/shared/schemas';
import type { TaskPriority } from '@buttercup/shared/types';
import { TASK_PRIORITY_LABELS } from '@buttercup/shared/constants';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { title: string; dueDate: string; priority: TaskPriority; assignedTo: string }) => void;
}

const PRIORITIES = Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[];

export function TaskFormModal({ open, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = taskCreateSchema
      .pick({ title: true, dueDate: true, priority: true, assignedTo: true })
      .safeParse({ title, dueDate, priority, assignedTo });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit}>
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} error={errors.title} />
        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {TASK_PRIORITY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Assigned to"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  );
}
