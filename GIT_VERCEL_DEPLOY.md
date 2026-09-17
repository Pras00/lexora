# Panduan Push GitHub & Deploy ke Vercel — Lexora

Dokumen ini memandu Anda dari inisialisasi Git lokal hingga aplikasi **Lexora** live dan berjalan di Vercel.

---

## Bagian A: Menghubungkan ke GitHub

### 1. Buat Repository Baru di GitHub
1. Buka [github.com/new](https://github.com/new).
2. Masukkan **Repository name**: `lexora` (atau nama pilihan Anda).
3. Biarkan opsi **Public** atau **Private** sesuai preferensi Anda.
4. **JANGAN** centang *"Initialize this repository with a README"* atau add .gitignore (karena proyek lokal kita sudah memilikinya).
5. Klik **"Create repository"**.
6. Salin URL repository Anda (contoh: `https://github.com/username/lexora.git`).

### 2. Push Kode Lokal ke GitHub
Jalankan perintah berikut di terminal komputer Anda (di dalam folder `d:\Pemrograman\NextJS\lexora`):

```bash
# 1. Pastikan git sudah siap dan cek status
git status

# 2. Tambahkan semua file proyek
git add .

# 3. Buat commit pertama
git commit -m "feat: complete initial lexora library system with Next.js 15 and Supabase"

# 4. Ganti branch utama menjadi main
git branch -M main

# 5. Hubungkan remote repository GitHub (ganti URL dengan repository Anda)
git remote add origin https://github.com/username/lexora.git

# 6. Push kode ke GitHub
git push -u origin main
```

---

## Bagian B: Deploy ke Vercel

### 1. Import Project di Vercel
1. Buka [vercel.com](https://vercel.com) dan login (disarankan menggunakan akun GitHub Anda).
2. Di Dashboard Vercel, klik tombol **"Add New..."** -> **"Project"**.
3. Temukan repository **lexora** yang baru saja Anda push, lalu klik **"Import"**.

### 2. Konfigurasi Environment Variables di Vercel
Sebelum menekan tombol Deploy, buka bagian **Environment Variables** (klik tanda panah untuk membuka form), lalu tambahkan key berikut satu per satu:

| Key | Value | Catatan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xyz.supabase.co` | Project URL dari Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Anon/Public API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Service Role Key (wajib untuk cron & admin) |
| `CRON_SECRET` | `lexora_secret_cron_2026` | Token otorisasi background jobs |
| `NEXT_PUBLIC_APP_URL` | `https://lexora.vercel.app` | Domain Vercel Anda (bisa diisi sementara, lalu disesuaikan) |
| `RESEND_API_KEY` | `re_...` | (Opsional jika ingin email aktif) |
| `RESEND_FROM_EMAIL` | `Lexora <onboarding@resend.dev>` | Alamat pengirim email |

### 3. Jalankan Deploy
1. Klik tombol **"Deploy"**.
2. Vercel akan otomatis meng-compile Next.js 15 App Router dan membuat deployment live dalam waktu ~1 menit.
3. Setelah selesai, Anda akan mendapatkan URL domain live Anda (misalnya: `https://lexora-iota.vercel.app`).

---

## Bagian C: Update Supabase Redirect URL (Penting!)

Agar login dan email verifikasi berfungsi di website live Vercel Anda:
1. Kembali ke [Dashboard Supabase](https://supabase.com/dashboard).
2. Pilih project Anda -> **Authentication** -> **URL Configuration**.
3. Pada **Site URL**, ganti menjadi domain Vercel Anda:
   `https://lexora-iota.vercel.app`
4. Pada **Redirect URLs**, tambahkan:
   - `https://lexora-iota.vercel.app/**`
   - `https://lexora-iota.vercel.app/auth/callback`
   - `http://localhost:3000/**` *(tetap pertahankan untuk pengujian lokal)*
5. Klik **Save**.

Selamat! Sistem Informasi Perpustakaan **Lexora** Anda kini telah online dan siap melayani peminjaman buku!
