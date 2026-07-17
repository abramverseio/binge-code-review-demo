interface StatCardProps {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'negative';
}

const TONE_CLASSES = {
  default: 'text-slate-900',
  positive: 'text-green-700',
  negative: 'text-red-600',
};

export function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</p>
    </div>
  );
}
