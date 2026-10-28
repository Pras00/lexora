'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { AuthBackground } from '@/components/layout/AuthBackground';
import { LexoraLogo } from '@/components/shared/LexoraLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Format email tidak valid.');
        return;
      }
      // Simulasi pengiriman instruksi reset kata sandi
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSuccess(true);
    } catch {
      setErrorMsg('Gagal memproses permintaan reset kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50/70 dark:bg-slate-950 transition-colors overflow-x-clip">
      <AuthBackground />
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-primary to-amber-500" />

          <div className="mb-5">
            <Link href="/" title="Kembali ke Beranda" className="inline-flex mb-4 group focus:outline-none">
              <LexoraLogo size="md" />
            </Link>
            <h2 className="text-xl font-bold text-foreground">Lupa Kata Sandi?</h2>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi.
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground">Email Terkirim</p>
              <p className="text-xs text-muted mt-1">
                Silakan periksa kotak masuk email Anda dan ikuti instruksi untuk mereset kata sandi.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Email Akun Anda
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}
              </button>

              <div className="text-center pt-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Batal dan kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
