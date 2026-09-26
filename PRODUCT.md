# Product Context — Lexora

## Purpose & Vision
Lexora adalah platform sistem informasi perpustakaan digital dan manajemen sirkulasi fisik modern. Dibangun untuk mendemokratisasi akses literatur dengan memadukan kenyamanan reservasi digital dan kecepatan pengambilan fisik tanpa antre melalui fitur **QR Pickup Pass**.

## Target Users & Primary Jobs
1. **Pemustaka / Anggota (Member)**
   - **Situasi:** Mencari buku pelajaran, fiksi, referensi, atau karya populer dari laptop/smartphone.
   - **Job to be Done:**
     - Mengeksplorasi katalog dengan status stok fisik *real-time*.
     - Mereservasi/meminjam buku tanpa harus mendatangi perpustakaan terlebih dahulu.
     - Mengambil buku di loket sirkulasi dalam hitungan detik dengan menunjukkan kode QR unik.
     - Memantau masa aktif pinjaman, tanggal jatuh tempo, riwayat pengembalian, dan tagihan denda.
2. **Pustakawan / Administrator (Admin)**
   - **Situasi:** Bertugas di loket sirkulasi dan ruang inventori perpustakaan fisik.
   - **Job to be Done:**
     - Memverifikasi pengajuan peminjaman (*review & approve*).
     - Menyerahkan buku kepada pemustaka dengan mencocokkan kode pickup.
     - Memproses pengembalian buku, mencatat keterlambatan, dan menerbitkan/melunaskan denda.
     - Menambah, mengedit, dan mengelola stok buku fisik serta kategori literatur.

## Key Differentiators
- **Instant QR Pickup Pass:** Eliminasi antrean panjang dan formulir kertas manual.
- **Physical-Digital Synchronization:** Stok buku fisik terupdate otomatis saat disetujui, dipinjam, atau dikembalikan.
- **Role-Based Experience:** Tampilan antarmuka yang disesuaikan secara presisi antara pemustaka (fokus eksplorasi & personal) dan pustakawan (fokus produktivitas & *high-density data*).
- **Soft Modern SaaS UI:** Desain bersih, tenang (*calm*), tipografi *Plus Jakarta Sans*, kontras tajam, bebas dari elemen klise/AI-slop.

## Brand Voice & Principles
- **Kredibel & Terpercaya:** Bahasa yang jelas, tidak ambigu, dan informatif.
- **Hangat & Ramah:** Mengedukasi pemustaka daripada menghakimi saat terjadi keterlambatan pinjam.
- **Efisien & Responsif:** Tata letak yang cepat dipindai (*scannable*) dan ramah perangkat bergerak (*mobile-friendly*).

## Platform & Technical Foundation
- **Platform:** Modern Web Application (Desktop & Mobile Web)
- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS v4 (@theme token mapping)
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **State & Utils:** Zustand, Lucide React, Framer Motion
