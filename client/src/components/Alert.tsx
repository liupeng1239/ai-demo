interface AlertProps {
  variant: 'success' | 'error';
  title: string;
  message: string;
}

const variantStyles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-rose-50 border-rose-200 text-rose-800',
};

export function Alert({ variant, title, message }: AlertProps) {
  return (
    <div className={`rounded-3xl border px-4 py-4 ${variantStyles[variant]}`}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6">{message}</p>
    </div>
  );
}
