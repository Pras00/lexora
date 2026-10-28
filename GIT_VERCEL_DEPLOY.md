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
| `DATABASE_URL` | `postgresql://neondb_owner:password@ep-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Connection pooling URL dari NeonDB |
| `DIRECT_URL` | `postgresql://neondb_owner:password@ep.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` | Direct connection URL dari NeonDB |
| `CRON_SECRET` | `lexora_secret_cron_2026` | Token otorisasi background jobs |
| `NEXT_PUBLIC_APP_URL` | `https://lexora.vercel.app` | Domain Vercel Anda |
| `RESEND_API_KEY` | `re_...` | (Opsional jika ingin notifikasi email aktif) |
| `RESEND_FROM_EMAIL` | `Lexora <onboarding@resend.dev>` | Alamat pengirim email |

### 3. Jalankan Deploy
1. Klik tombol **"Deploy"**.
2. Vercel akan otomatis meng-compile Next.js App Router dan membuat deployment live dalam waktu ~1 menit.
3. Setelah selesai, Anda akan mendapatkan URL domain live Anda (misalnya: `https://lexora.vercel.app`).

4. Pada **Redirect URLs**, tambahkan:
   - `https://lexora-iota.vercel.app/**`
   - `https://lexora-iota.vercel.app/auth/callback`
   - `http://localhost:3000/**` *(tetap pertahankan untuk pengujian lokal)*
5. Klik **Save**.

Selamat! Sistem Informasi Perpustakaan **Lexora** Anda kini telah online dan siap melayani peminjaman buku!
