import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/DATABASE_URL=([^\r\n]+)/);
if (!match) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const url = match[1].replace(/[?&]channel_binding=[^&]+/g, '').trim();
const sql = neon(url);

const newCategories = [
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    name: 'Pengembangan Diri',
    slug: 'pengembangan-diri',
    description: 'Buku motivasi, pembentukan kebiasaan, stoikisme, dan psikologi terapan.',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    name: 'Sejarah & Humaniora',
    slug: 'sejarah-humaniora',
    description: 'Karya sejarah peradaban, antropologi sosial, dan telaah budaya dunia.',
  },
];

const newBooks = [
  {
    title: 'Pulang - Pergi',
    author: 'Tere Liye',
    isbn: '978-623-96031-8-2',
    category_id: 'a0000000-0000-0000-0000-000000000003', // Fiksi & Sastra
    publisher: 'Sabak Grip Nusantara',
    published_year: 2021,
    description: 'Pertarungan sengit antara keluarga shadow economy Bujang dan Thomas yang berlatar intrik kejahatan tingkat tinggi antarnegara.',
    cover_url: '/covers/pulang-pergi.jpg',
    price: 98000,
    total_stock: 6,
    available_stock: 4,
  },
  {
    title: 'Harry Potter dan Batu Bertuah',
    author: 'J.K. Rowling',
    isbn: '978-602-03-3474-5',
    category_id: 'a0000000-0000-0000-0000-000000000003', // Fiksi & Sastra
    publisher: 'Gramedia Pustaka Utama',
    published_year: 2017,
    description: 'Tahun pertama Harry Potter di Sekolah Sihir Hogwarts saat ia mengungkap konspirasi legendaris Batu Bertuah dan asal-usul takdirnya.',
    cover_url: '/covers/harry-potter.jpg',
    price: 145000,
    total_stock: 5,
    available_stock: 3,
  },
  {
    title: 'Laut Bercerita',
    author: 'Leila S. Chudori',
    isbn: '978-602-424-694-5',
    category_id: 'a0000000-0000-0000-0000-000000000003', // Fiksi & Sastra
    publisher: 'Kepustakaan Populer Gramedia',
    published_year: 2017,
    description: 'Kisah Biru Laut dan kawan-kawan aktivis mahasiswa 1998 yang hilang diculik, serta penantian panjang keluarga yang tak kunjung padam.',
    cover_url: '/covers/laut-bercerita.jpg',
    price: 115000,
    total_stock: 7,
    available_stock: 5,
  },
  {
    title: 'Cantik Itu Luka',
    author: 'Eka Kurniawan',
    isbn: '978-602-03-1258-3',
    category_id: 'a0000000-0000-0000-0000-000000000003', // Fiksi & Sastra
    publisher: 'Gramedia Pustaka Utama',
    published_year: 2015,
    description: 'Roman realisme magis tentang Dewi Ayu dan putri-putrinya di kota fiktif Halimunda dengan latar sejarah kelam kolonialisme dan revolusi.',
    cover_url: '/covers/cantik-itu-luka.jpg',
    price: 130000,
    total_stock: 4,
    available_stock: 3,
  },
  {
    title: 'Gadis Kretek',
    author: 'Ratih Kumala',
    isbn: '978-979-22-8141-5',
    category_id: 'a0000000-0000-0000-0000-000000000003', // Fiksi & Sastra
    publisher: 'Gramedia Pustaka Utama',
    published_year: 2012,
    description: 'Misteri pencarian Jeng Yah, peracik saus rokok kretek legendaris yang menyimpan kisah asmara dan persaingan bisnis tembakau di Jawa era 1960-an.',
    cover_url: '/covers/gadis-kretek.jpg',
    price: 95000,
    total_stock: 5,
    available_stock: 4,
  },
  {
    title: 'Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa',
    author: 'James Clear',
    isbn: '978-602-06-3317-6',
    category_id: 'a0000000-0000-0000-0000-000000000005', // Pengembangan Diri
    publisher: 'Gramedia Pustaka Utama',
    published_year: 2019,
    description: 'Kerangka praktis berbasis sains perilaku untuk membangun kebiasaan baik dan meruntuhkan kebiasaan buruk secara bertahap melalui sistem 1 persen.',
    cover_url: '/covers/atomic-habits.jpg',
    price: 118000,
    total_stock: 8,
    available_stock: 6,
  },
  {
    title: 'Filosofi Teras: Panduan Stoikisme Khas Mental Tangguh',
    author: 'Henry Manampiring',
    isbn: '978-602-412-518-9',
    category_id: 'a0000000-0000-0000-0000-000000000005', // Pengembangan Diri
    publisher: 'Penerbit Buku Kompas',
    published_year: 2019,
    description: 'Penerapan filsafat Stoa kuno untuk mengatasi kekhawatiran berlebih, emosi negatif, dan membangun ketenangan batin generasi masa kini.',
    cover_url: '/covers/filosofi-teras.jpg',
    price: 108000,
    total_stock: 7,
    available_stock: 4,
  },
  {
    title: 'Sebuah Seni untuk Bersikap Bodo Amat',
    author: 'Mark Manson',
    isbn: '978-602-452-698-6',
    category_id: 'a0000000-0000-0000-0000-000000000005', // Pengembangan Diri
    publisher: 'Grasindo',
    published_year: 2018,
    description: 'Pendekatan jujur dan realistis tanpa basa-basi tentang menerima keterbatasan hidup dan hanya memedulikan hal-hal yang benar-benar bermakna.',
    cover_url: '/covers/bodo-amat.jpg',
    price: 95000,
    total_stock: 6,
    available_stock: 3,
  },
  {
    title: 'The Psychology of Money: Uang, Kepalsuan & Kebahagiaan',
    author: 'Morgan Housel',
    isbn: '978-602-6486-53-0',
    category_id: 'a0000000-0000-0000-0000-000000000004', // Bisnis & Manajemen
    publisher: 'Penerbit Baca',
    published_year: 2021,
    description: '19 cerita pendek menyingkap cara unik manusia memperlakukan uang serta bagaimana perilaku dan psikologi menentukan kesuksesan finansial.',
    cover_url: '/covers/psychology-of-money.jpg',
    price: 125000,
    total_stock: 6,
    available_stock: 5,
  },
  {
    title: 'Sapiens: Riwayat Singkat Umat Manusia',
    author: 'Yuval Noah Harari',
    isbn: '978-602-424-416-3',
    category_id: 'a0000000-0000-0000-0000-000000000006', // Sejarah & Humaniora
    publisher: 'Kepustakaan Populer Gramedia',
    published_year: 2017,
    description: 'Penelusuran menyeluruh tentang evolusi spesies Homo sapiens dari pemburu-peramu tak berarti hingga menjadi penguasa planet bumi.',
    cover_url: '/covers/sapiens.jpg',
    price: 165000,
    total_stock: 5,
    available_stock: 3,
  },
  {
    title: 'Guns, Germs, and Steel: Bedil, Kuman, dan Baja',
    author: 'Jared Diamond',
    isbn: '978-979-91-0611-7',
    category_id: 'a0000000-0000-0000-0000-000000000006', // Sejarah & Humaniora
    publisher: 'Kepustakaan Populer Gramedia',
    published_year: 2014,
    description: 'Analisis brilian mengapa peradaban benua tertentu berkembang lebih pesat dibanding yang lain ditinjau dari faktor geografis dan lingkungan.',
    cover_url: '/covers/guns-germs-steel.jpg',
    price: 155000,
    total_stock: 4,
    available_stock: 2,
  },
  {
    title: 'Nusantara: Sejarah Indonesia',
    author: 'Bernard H.M. Vlekke',
    isbn: '978-602-424-699-0',
    category_id: 'a0000000-0000-0000-0000-000000000006', // Sejarah & Humaniora
    publisher: 'Kepustakaan Populer Gramedia',
    published_year: 2022,
    description: 'Rujukan historis klasik terlengkap mengenai perjalanan politik, perdagangan rempah, dan kebudayaan maritim Nusantara sejak zaman kuno.',
    cover_url: '/covers/nusantara.jpg',
    price: 140000,
    total_stock: 4,
    available_stock: 3,
  },
  {
    title: 'Kosmos (Cosmos)',
    author: 'Carl Sagan',
    isbn: '978-602-424-230-5',
    category_id: 'a0000000-0000-0000-0000-000000000002', // Sains & Matematika
    publisher: 'Kepustakaan Populer Gramedia',
    published_year: 2016,
    description: 'Mahakarya literatur ilmiah tentang petualangan 15 miliar tahun evolusi kosmik, penjelajahan bintang, dan pemahaman tempat manusia di alam semesta.',
    cover_url: '/covers/kosmos.jpg',
    price: 150000,
    total_stock: 5,
    available_stock: 4,
  },
  {
    title: 'Thinking, Fast and Slow: Berpikir Cepat dan Lambat',
    author: 'Daniel Kahneman',
    isbn: '978-602-06-3183-7',
    category_id: 'a0000000-0000-0000-0000-000000000002', // Sains & Matematika
    publisher: 'Gramedia Pustaka Utama',
    published_year: 2019,
    description: 'Teori peraih Nobel Ekonomi tentang dua sistem yang mengendalikan cara pikir manusia: Sistem 1 yang intuitif dan Sistem 2 yang analitis.',
    cover_url: '/covers/thinking-fast-slow.jpg',
    price: 175000,
    total_stock: 4,
    available_stock: 2,
  },
  {
    title: 'The Pragmatic Programmer: Your Journey to Mastery',
    author: 'David Thomas, Andrew Hunt',
    isbn: '978-0135957059',
    category_id: 'a0000000-0000-0000-0000-000000000001', // Teknologi & Pemrograman
    publisher: 'Addison-Wesley Professional',
    published_year: 2019,
    description: 'Panduan praktis esensial tentang pola pikir rekayasa perangkat lunak, kebiasaan profesional, dan ketahanan arsitektur kode modern.',
    cover_url: '/covers/pragmatic-programmer.jpg',
    price: 320000,
    total_stock: 5,
    available_stock: 3,
  },
  {
    title: 'Zero to One: Catatan tentang Startup & Membangun Masa Depan',
    author: 'Peter Thiel',
    isbn: '978-602-03-1259-0',
    category_id: 'a0000000-0000-0000-0000-000000000004', // Bisnis & Manajemen
    publisher: 'Gramedia Pustaka Utama',
    published_year: 2015,
    description: 'Filosofi revolusioner membangun inovasi vertikal dari 0 ke 1, menciptakan produk yang belum pernah ada, dan memonopoli nilai baru.',
    cover_url: '/covers/zero-to-one.jpg',
    price: 110000,
    total_stock: 6,
    available_stock: 4,
  },
];

async function seed() {
  console.log('Seeding new categories to NeonDB...');
  for (const cat of newCategories) {
    await sql`
      INSERT INTO categories (id, name, slug, description, created_at)
      VALUES (${cat.id}, ${cat.name}, ${cat.slug}, ${cat.description}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description
    `;
    console.log(`✓ Category: ${cat.name}`);
  }

  console.log('\nSeeding 16 new popular books to NeonDB...');
  for (const b of newBooks) {
    await sql`
      INSERT INTO books (
        title, author, isbn, category_id, publisher, published_year,
        description, cover_url, price, total_stock, available_stock, status,
        created_at, updated_at
      )
      VALUES (
        ${b.title}, ${b.author}, ${b.isbn}, ${b.category_id}, ${b.publisher}, ${b.published_year},
        ${b.description}, ${b.cover_url}, ${b.price}, ${b.total_stock}, ${b.available_stock}, 'active',
        NOW(), NOW()
      )
      ON CONFLICT (isbn) DO UPDATE SET
        title = EXCLUDED.title,
        author = EXCLUDED.author,
        category_id = EXCLUDED.category_id,
        publisher = EXCLUDED.publisher,
        published_year = EXCLUDED.published_year,
        description = EXCLUDED.description,
        cover_url = EXCLUDED.cover_url,
        price = EXCLUDED.price,
        total_stock = EXCLUDED.total_stock,
        available_stock = EXCLUDED.available_stock,
        status = 'active',
        updated_at = NOW()
    `;
    console.log(`✓ Book: ${b.title}`);
  }

  const [countRes] = await sql`SELECT count(*) as total FROM books`;
  const [catRes] = await sql`SELECT count(*) as total FROM categories`;
  console.log(`\n🎉 Seed completed! Total books in DB: ${countRes.total}, Total categories: ${catRes.total}`);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

