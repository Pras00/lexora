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
    '/covers/clean-code.jpg',
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
    '/covers/ddia.jpg',
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
    '/covers/refactoring.jpg',
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
    '/covers/bumi-manusia.jpg',
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
    '/covers/laskar-pelangi.jpg',
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
    '/covers/lean-startup.jpg',
    220000,
    4,
    4,
    'active'
),
(
    'Stargate''s Echo: Journey Beyond the Void',
    'Alistair Vance',
    '978-602-04-1102-1',
    'a0000000-0000-0000-0000-000000000003',
    'CosmoSphere Publishing',
    2025,
    'Penjelajahan epik seorang astronaut menembus gerbang antariksa purba melintasi galaksi tak terjamah untuk mengungkap misteri peradaban awal alam semesta.',
    '/covers/stargates-echo.jpg',
    175000,
    5,
    5,
    'active'
),
(
    'The Wanderer''s Star',
    'Elara Vance',
    '978-602-04-2203-4',
    'a0000000-0000-0000-0000-000000000003',
    'Mythic Realm Editions',
    2025,
    'Kisah pengembara pemegang tongkat kristal bintang yang harus mencapai Menara Samudra Utara di bawah pendaran aurora magis untuk memulihkan keseimbangan cahaya.',
    '/covers/the-wanderers-star.jpg',
    165000,
    4,
    4,
    'active'
),
(
    'Neon Ghost: A Cyberpunk Thriller',
    'K.J. Armstrong',
    '978-602-04-3304-7',
    'a0000000-0000-0000-0000-000000000001',
    'CyberNet Fiction Press',
    2026,
    'Ketegangan di megapolis Night City ketika seorang agen bayangan cybernetic memburu dalang di balik peretasan sistem kecerdasan buatan pusat pengendali kota.',
    '/covers/neon-ghost.jpg',
    185000,
    6,
    6,
    'active'
),
(
    'Harmoni Semesta Kuantum: Menyingkap Simfoni Partikel',
    'Dr. Maya Sastroamidjojo',
    '978-602-01-9821-3',
    'a0000000-0000-0000-0000-000000000002',
    'Lexora Academic Press',
    2025,
    'Eksplorasi mendalam mengenai jalinan kuantum, keterikatan partikel, dan misteri materi gelap yang dipaparkan dengan narasi puitis serta analogi resonansi musikal.',
    '/covers/semesta-kuantum.jpg',
    195000,
    5,
    5,
    'active'
),
(
    'Bisikan Kabut Batavia: Misteri Pelabuhan Kalapa',
    'Tirto Hadiningrat',
    '978-602-02-7719-2',
    'a0000000-0000-0000-0000-000000000003',
    'Pustaka Nusa Antara',
    2024,
    'Konspirasi hilangnya manuskrip peta rahasia maritim dan serangkaian teka-teki di sudut-sudut berkabut Batavia era kolonial 1920-an.',
    '/covers/kabut-batavia.jpg',
    135000,
    4,
    4,
    'active'
),
(
    'Ekonomi Sirkular Biru: Cetak Biru Inovasi Hijau Masa Depan',
    'Hendrawan Santika',
    '978-602-03-4412-8',
    'a0000000-0000-0000-0000-000000000004',
    'Cakrawala Bisnis Mandiri',
    2025,
    'Panduan kepemimpinan visioner dan model bisnis regeneratif tanpa limbah di era transisi energi global dan ekonomi maritim berkelanjutan.',
    '/covers/ekonomi-biru.jpg',
    210000,
    6,
    6,
    'active'
)
ON CONFLICT (isbn) DO NOTHING;
