interface StatusBadgeProps {
  label: string;
  variant: 'approved' | 'pending' | 'rejected';
}

const variants = {
  approved: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-rose-100 text-rose-800',
};

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${variants[variant]}`}>{label}</span>;
}
