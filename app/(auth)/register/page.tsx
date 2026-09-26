import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

export default function RegisterPage() {
  return (
    <AuthSplitLayout
      title="Daftar Anggota Baru"
      subtitle="Buat akun kartu anggota digital untuk mulai meminjam buku koleksi perpustakaan."
      footerText="Sudah terdaftar sebagai anggota?"
      footerLinkText="Masuk di sini"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthSplitLayout>
  );
}
