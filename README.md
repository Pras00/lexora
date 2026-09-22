# 📚 Lexora - Sistem Informasi Perpustakaan Modern

Lexora adalah platform sistem informasi perpustakaan digital berbasis web yang dirancang dengan antarmuka **Soft Modern SaaS UI**. Platform ini memudahkan pengelolaan inventori buku, sirkulasi peminjaman, serta memberikan pengalaman anggota yang lancar melalui fitur peminjaman mandiri berbasis **QR Pickup Pass**.

![Lexora Preview](/public/covers/clean-code.jpg) *(Tambahkan screenshot aplikasi di sini)*

## ✨ Fitur Utama

- **Katalog Digital Terintegrasi:** Eksplorasi ratusan literatur dengan sistem pencarian pintar, filter kategori, dan pantauan stok fisik secara *real-time*.
- **Peminjaman Tanpa Antre (QR Pass):** Anggota dapat mengajukan peminjaman buku dari mana saja. Setelah disetujui, sistem akan menerbitkan *QR Pickup Pass* untuk mempercepat proses pengambilan di loket.
- **Role-based Access Control (RBAC):** 
  - **Anggota (Member):** Dashboard personal untuk memantau status peminjaman, riwayat pengembalian, dan tagihan denda.
  - **Pustakawan (Admin):** Panel khusus untuk menyetujui pengajuan, mengelola sirkulasi (peminjaman & pengembalian), serta manajemen inventori buku dan kategori.
- **Manajemen Denda Otomatis:** Perhitungan tagihan denda keterlambatan secara otomatis berdasarkan tanggal jatuh tempo pengembalian.
- **UI/UX Modern:** Desain antarmuka *Soft SaaS* yang responsif, bersih, mendukung mode Gelap/Terang (*Dark/Light Mode*), dan bebas dari elemen yang berlebihan.

## 🛠️ Teknologi yang Digunakan

Lexora dibangun menggunakan ekosistem *web development* modern:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, React Server Components, Turbopack)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth)
- **Ikonografi:** [Lucide React](https://lucide.dev/)

## 🚀 Panduan Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan Lexora di komputer lokal Anda.

### 1. Prasyarat
- **Node.js** (versi 18.17 atau yang lebih baru)
- **Akun Supabase** (untuk manajemen Database dan Auth)

### 2. Kloning Repositori
```bash
git clone https://github.com/Pras00/lexora.git
cd lexora
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file `.env.local` di root direktori proyek, lalu tambahkan kredensial Supabase milik Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Inisialisasi Database (Supabase)
Jalankan skrip SQL yang berada di dalam folder `supabase/schema.sql` pada SQL Editor di dashboard Supabase Anda untuk membangun struktur tabel, fungsi otomatis, dan RLS (Row Level Security).

### 6. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## 📁 Struktur Direktori Utama

```
lexora/
├── app/               # Rute aplikasi Next.js (App Router)
│   ├── (admin)/       # Halaman khusus peran Admin (Dashboard, Inventori, dll)
│   ├── (auth)/        # Halaman autentikasi (Login, Register)
│   ├── (user)/        # Halaman khusus Anggota (Dashboard Anggota, Profil, dll)
│   ├── api/           # API Routes dan Cron Jobs
│   └── globals.css    # Variabel CSS & Tema Global
├── components/        # Komponen UI React yang dapat digunakan ulang (Reusable)
├── lib/               # Utilitas, konfigurasi, dan Supabase Client (Middleware/Server/Client)
├── scripts/           # Skrip otomatisasi (Seeding Database, Generate Mockup)
├── stores/            # Manajemen State global (mis. Zustand)
├── supabase/          # Skema database SQL dan panduan Supabase
└── types/             # Definisi tipe (Types/Interfaces) TypeScript
```

## 🤝 Berkontribusi

Kontribusi selalu diterima! Jika Anda menemukan kutu (*bug*) atau memiliki ide fitur menarik:
1. *Fork* repositori ini
2. Buat *branch* fitur Anda (`git checkout -b fitur-baru`)
3. Lakukan *commit* perubahan Anda (`git commit -m 'Menambahkan fitur XYZ'`)
4. Lakukan *push* ke *branch* tersebut (`git push origin fitur-baru`)
5. Buka *Pull Request* baru

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.
