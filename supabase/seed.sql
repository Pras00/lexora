-- ==============================================================================
-- LEXORA — SAMPLE SEED DATA
-- Data Awal Kategori dan Buku untuk Uji Coba Katalog Perpustakaan
-- ==============================================================================

-- 1. Kategori Buku
INSERT INTO public.categories (id, name, slug, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'Teknologi & Pemrograman', 'teknologi-pemrograman', 'Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.'),
('a0000000-0000-0000-0000-000000000002', 'Sains & Matematika', 'sains-matematika', 'Buku ilmu pengetahuan alam, fisika, biologi, dan matematika murni.'),
('a0000000-0000-0000-0000-000000000003', 'Fiksi & Sastra', 'fiksi-sastra', 'Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.'),
('a0000000-0000-0000-0000-000000000004', 'Bisnis & Manajemen', 'bisnis-manajemen', 'Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Sampel Koleksi Buku
INSERT INTO public.books (title, author, isbn, category_id, publisher, published_year, description, cover_url, price, total_stock, available_stock, status) VALUES
(
    'Clean Code: A Handbook of Agile Software Craftsmanship',
    'Robert C. Martin',
    '978-0132350884',
    'a0000000-0000-0000-0000-000000000001',
    'Prentice Hall',
    2008,
    'Panduan legendaris tentang penulisan kode bersih, keterbacaan kode, dan refactoring untuk insinyur perangkat lunak profesional.',
    'https://images.unsplash.com/photo-1532012164546-f432f2e37b29?w=600&auto=format&fit=crop&q=80',
    250000,
    5,
    5,
    'active'
),
(
    'Designing Data-Intensive Applications',
    'Martin Kleppmann',
    '978-1449373320',
    'a0000000-0000-0000-0000-000000000001',
    'O''Reilly Media',
    2017,
    'Prinsip komprehensif di balik arsitektur sistem terdistribusi, database reliabel, skalabilitas data, dan konsistensi transaksi.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    380000,
    4,
    4,
    'active'
),
(
    'Refactoring: Improving the Design of Existing Code',
    'Martin Fowler',
    '978-0134757599',
    'a0000000-0000-0000-0000-000000000001',
    'Addison-Wesley Professional',
    2018,
    'Katalog teknik refactoring untuk mengubah struktur internal perangkat lunak tanpa mengubah perilaku eksternalnya.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    310000,
    3,
    3,
    'active'
),
(
    'Bumi Manusia',
    'Pramoedya Ananta Toer',
    '978-9799731234',
    'a0000000-0000-0000-0000-000000000003',
    'Lentera Dipantara',
    1980,
    'Roman sejarah yang mengisahkan pergulatan intelektual Minke di era kolonial Hindia Belanda.',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    115000,
    6,
    6,
    'active'
),
(
    'Laskar Pelangi',
    'Andrea Hirata',
    '978-9793062792',
    'a0000000-0000-0000-0000-000000000003',
    'Bentang Pustaka',
    2005,
    'Kisah inspiratif sepuluh anak laskar pelangi dalam memperjuangkan pendidikan di tanah Belitung.',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&auto=format&fit=crop&q=80',
    89000,
    5,
    5,
    'active'
),
(
    'The Lean Startup',
    'Eric Ries',
    '978-0307887894',
    'a0000000-0000-0000-0000-000000000004',
    'Crown Business',
    2011,
    'Metodologi inovasi berkelanjutan dan validasi ide bisnis dengan pendekatan Build-Measure-Learn.',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    220000,
    4,
    4,
    'active'
)
ON CONFLICT (isbn) DO NOTHING;
