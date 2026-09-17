# Panduan Setup & Koneksi Supabase — Lexora

Dokumen ini memandu Anda langkah demi langkah untuk menghubungkan database Supabase dengan sistem informasi perpustakaan **Lexora**.

---

## 1. Membuat Project Baru di Supabase

1. Buka [database.new](https://database.new) atau login ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Klik tombol **"New Project"**.
3. Pilih Organization Anda.
4. Masukkan konfigurasi project:
   - **Name:** `lexora` (atau nama pilihan Anda)
   - **Database Password:** Buat password yang kuat (simpan di password manager Anda).
   - **Region:** Pilih region terdekat (misal: `Singapore (ap-southeast-1)` untuk latency terendah dari Indonesia).
   - **Pricing Plan:** Free Plan (cukup untuk development & operasional awal).
5. Klik **"Create new project"** dan tunggu 1–2 menit hingga database selesai disiapkan.

---

## 2. Menjalankan Skrip Migrasi SQL

Kita sudah menyiapkan 2 file SQL di folder `supabase/`:
* `supabase/schema.sql` (struktur tabel, enum, trigger auto-number, RPC stok atomik, dan RLS)
* `supabase/seed.sql` (kategori awal & 6 buku sampel siap uji coba)

### Langkah Eksekusi:
1. Di Dashboard Supabase Anda, klik menu **SQL Editor** (ikon terminal `>_` di sidebar kiri).
2. Klik **"+ New query"**.
3. Buka file `supabase/schema.sql` di editor kode Anda, copy seluruh isinya, lalu paste ke SQL Editor Supabase.
4. Klik tombol hijau **"Run"** (atau tekan `Ctrl + Enter`).
   - Pastikan muncul pesan `Success. No rows returned`.
5. Buat query baru lagi (**"+ New query"**).
6. Buka file `supabase/seed.sql`, copy isinya, lalu paste ke SQL Editor Supabase.
7. Klik tombol **"Run"**.
   - Kategori dan buku percontohan kini sudah masuk ke database!

Untuk memastikan, buka menu **Table Editor** di sidebar kiri. Anda akan melihat tabel:
- `books` (berisi 6 buku)
- `categories` (berisi 4 kategori)
- `profiles`, `loan_requests`, `loans`, `fines`, dsb.

---

## 3. Mengambil API Credentials

1. Buka menu **Project Settings** (ikon gerigi di pojok kiri bawah).
2. Pilih tab **Data API** (atau **API**).
3. Anda akan melihat bagian **Project URL** dan **Project API keys**:
   - Salin **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - Salin **anon / public key** (key panjang berawalan `eyJ...`)
   - Salin **service_role key** (klik *Reveal* terlebih dahulu). *Catatan: Jangan pernah membagikan service_role key ke sisi browser/publik!*

---

## 4. Mengisi `.env.local`

1. Di root folder project `lexora/`, buat file bernama `.env.local` (atau duplikasi dari `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
2. Isi nilai yang baru saja Anda salin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhxxxxxxxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJhxxxxxxxxx...
   
   # Untuk email via Resend (bisa diisi nanti):
   RESEND_API_KEY=re_xxxxxxxxx
   RESEND_FROM_EMAIL=Lexora <onboarding@resend.dev>
   
   # Token rahasia cron job:
   CRON_SECRET=lexora_secret_cron_2026
   
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

---

## 5. Konfigurasi Auth (Redirect URLs)

Agar proses registrasi dan konfirmasi email berjalan lancar:
1. Di Dashboard Supabase, buka menu **Authentication** -> **URL Configuration**.
2. Di bagian **Site URL**, masukkan:
   `http://localhost:3000`
3. Di bagian **Redirect URLs**, tambahkan:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
   *(Nanti saat deploy ke Vercel, kita tinggal tambahkan domain Vercel Anda di sini)*.
4. Klik **Save**.

Database dan autentikasi Anda sekarang sudah siap 100% digunakan oleh aplikasi Lexora!
