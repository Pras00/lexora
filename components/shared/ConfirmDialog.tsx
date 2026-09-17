'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 z-10 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  variant === 'danger'
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                  {description}
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-[var(--muted)] hover:text-[var(--foreground)] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors flex items-center gap-2 ${
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Memproses...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
