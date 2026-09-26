---
name: Lexora
description: Soft Modern SaaS Design System for Digital Library & Physical Circulation
colors:
  primary: "#4F46E5"
  primary-hover: "#4338CA"
  accent: "#6366F1"
  accent-subtle: "#EEF2FF"
  background: "#F8FAFC"
  foreground: "#0F172A"
  surface: "#FFFFFF"
  surface-secondary: "#F1F5F9"
  border: "#E2E8F0"
  border-strong: "#CBD5E1"
  muted: "#64748B"
  success: "#10B981"
  warning: "#F59E0B"
  danger: "#EF4444"
  dark-background: "#0B0F19"
  dark-foreground: "#F8FAFC"
  dark-surface: "#131A2B"
  dark-border: "#1E293B"
  dark-muted: "#94A3B8"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
    fontWeight: 400
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "20px"
---

# Design System — Lexora

## 1. Overview
Lexora mengadopsi estetika **Soft Modern SaaS**. Prinsip intinya adalah:
- **Tenang & Bersih (Calm & Uncluttered):** Tidak ada efek glow berlebihan, neon gradien yang mencolok, atau elemen visual tiruan yang mengalihkan perhatian pemustaka.
- **Tipografi Berkarakter:** Menggunakan satu jenis font modern (*Plus Jakarta Sans*) dengan hierarki ketebalan bobot (*weight hierarchy*) yang tegas untuk membedakan judul, label status, dan teks isi.
- **Kontras & Aksesibilitas Tinggi:** Standar kontras teks minimal WCAG AA untuk keterbacaan optimal di siang maupun malam hari (*Dark Mode*).

## 2. Colors & Semantic Mapping
Semua warna diatur melalui variabel CSS di `app/globals.css` dan terhubung otomatis ke `@theme` Tailwind CSS v4:
- `bg-background` / `text-foreground`: Latar dan teks utama.
- `bg-surface`: Latar kartu, container, dan panel sidebar.
- `bg-surface-secondary`: Latar field input, hover state, dan badge netral.
- `border-border`: Garis batas lembut (`#E2E8F0` di Light, `#1E293B` di Dark).
- `text-muted`: Keterangan sekunder, metadata penerbit, tanggal jatuh tempo.
- `bg-primary` / `text-primary`: Indigo `#4F46E5` untuk aksi utama (*CTA*, pinjam buku).

## 3. Typography
- **Primary Font:** *Plus Jakarta Sans* via `next/font/google`.
- **Display / Hero:** 36px–60px (Font-extrabold, tracking-tight).
- **Section Heading:** 20px–28px (Font-bold).
- **Body & Metadata:** 13px–15px (Font-normal / Font-medium).
- **Badges & Micro-tags:** 10px–12px (Font-bold / uppercase tracking-wider).

## 4. Layout & Spacing
- **Sidebar & TopBar:** Tetap terkunci (*sticky/fixed*) sehingga saat pengguna menggulir konten, navigasi utama tetap berada di posisinya.
- **Grid Layout:** 
  - Katalog Buku: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`.
  - Dasbor Statistik: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
- **Max Width:** Halaman dibatasi pada `max-w-7xl mx-auto` untuk kenyamanan membaca di monitor ultra-lebar.

## 5. Elevation & Depth
- Menghindari bayangan hitam tajam (*harsh shadows*).
- Gunakan bayangan halus multi-layer: `shadow-xs` untuk state default, `shadow-sm` untuk kartu elevated, dan `hover:shadow-md` untuk interaksi hover pada buku.
- Batas tipis 1px (`border border-border`) digunakan untuk mendefinisikan batas fisik kartu tanpa terkesan kaku.

## 6. Shapes & Rounding
- Sudut membulat modern:
  - Tombol & Badge: `rounded-xl` (12px).
  - Kartu & Dialog: `rounded-2xl` (16px) hingga `rounded-3xl` (24px).
  - Avatar & Indikator: `rounded-full`.

## 7. Components & Micro-interactions
- **BookCard:** Menampilkan cover proporsional rasio 3:4, label kategori mengambang (*pill badge*), indikator ketersediaan stok fisik, dan tombol aksi "Pinjam".
- **StatCard:** Menampilkan ikon bernuansa pastel lembut (*subtle tint*), metrik angka berbobot tebal, dan konteks ringkas di bawahnya.
- **PickupPass:** QR code bersih dengan kontras tinggi, dilengkapi nomor referensi dan batas waktu kedaluwarsa.

## 8. Do's and Don'ts
- **DO:** Gunakan utility class canonical seperti `bg-surface`, `text-foreground`, `border-border`.
- **DO:** Berikan umpan balik langsung (*feedback*) saat pemustaka menekan tombol aksi (misal: penambahan buku ke keranjang).
- **DON'T:** Jangan gunakan gradien neon terang atau efek bayangan hitam pekat.
- **DON'T:** Jangan biarkan teks input/field menyatu dengan background tanpa pembeda kontras yang jelas.
- **DON'T:** Hindari penggunaan tipe data `any` dalam komponen TypeScript.
