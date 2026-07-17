import type { Task } from '@buttercup/shared/types';
import { TASK_PRIORITY_LABELS } from '@buttercup/shared/constants';
import { Badge } from '@/components/Badge';

const PRIORITY_TONE = { high: 'danger', medium: 'warning', low: 'neutral' } as const;

interface TaskListProps {
  tasks: Task[];
  onToggleCompleted: (task: Task) => void;
}

export function TaskList({ tasks, onToggleCompleted }: TaskListProps) {
  return (
    <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-start gap-3 p-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompleted(task)}
            className="mt-1"
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {task.title}
              </p>
              <Badge tone={PRIORITY_TONE[task.priority]}>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
            </div>
            {task.description && <p className="text-sm text-slate-500">{task.description}</p>}
            <p className="text-xs text-slate-400">
              Due {task.dueDate}
              {task.assignedTo && ` · ${task.assignedTo}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
