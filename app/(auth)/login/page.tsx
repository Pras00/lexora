import { LoginForm } from '@/components/auth/LoginForm';
import { Suspense } from 'react';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

export default function LoginPage() {
  return (
    <AuthSplitLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk ke akun pemustaka untuk melanjutkan aktivitas membaca dan peminjaman Anda."
      footerText="Belum memiliki kartu anggota?"
      footerLinkText="Daftar sekarang"
      footerLinkHref="/register"
    >
      <Suspense
        fallback={
          <div className="h-40 flex items-center justify-center text-xs font-semibold text-muted">
            Memuat formulir...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
