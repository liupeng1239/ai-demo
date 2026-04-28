import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-surface-container-high px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold text-on-surface">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition hover:bg-surface-container-highest"
            aria-label="关闭"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>

        {footer ? <div className="border-t border-surface-container-high px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
