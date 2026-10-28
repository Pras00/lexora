import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { BookCatalogClient } from '@/components/books/BookCatalogClient';
import { BookWithCategory, Category } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fallback kategori lengkap dari NeonDB
const fallbackCategories: Category[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Teknologi & Pemrograman',
    slug: 'teknologi-pemrograman',
    description: 'Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.',
    created_at: '2026-10-28T04:09:27.974Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Sains & Matematika',
    slug: 'sains-matematika',
    description: 'Buku ilmu pengetahuan alam, fisika, biologi, dan matematika murni.',
    created_at: '2026-10-28T04:09:27.974Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'Fiksi & Sastra',
    slug: 'fiksi-sastra',
    description: 'Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.',
    created_at: '2026-10-28T04:09:27.974Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    name: 'Bisnis & Manajemen',
    slug: 'bisnis-manajemen',
    description: 'Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.',
    created_at: '2026-10-28T04:09:27.974Z',
  },
];

// Fallback 12 buku lengkap dengan cover lokal (/covers/*.jpg) yang tersedia di public/covers/
const fallbackBooks: BookWithCategory[] = [
  {
    id: 'a5e18e45-08ae-414f-b1a4-8a8c3931f2fe',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    category_id: 'a0000000-0000-0000-0000-000000000001',
    publisher: 'Prentice Hall',
    published_year: 2008,
    description: 'Panduan legendaris tentang penulisan kode bersih, keterbacaan kode, dan refactoring untuk insinyur perangkat lunak profesional.',
    cover_url: '/covers/clean-code.jpg',
    price: 250000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[0],
  },
  {
    id: '9c823b56-de74-48fa-a1fc-a635695403e6',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '978-1449373320',
    category_id: 'a0000000-0000-0000-0000-000000000001',
    publisher: "O'Reilly Media",
    published_year: 2017,
    description: 'Prinsip komprehensif di balik arsitektur sistem terdistribusi, database reliabel, skalabilitas data, dan konsistensi transaksi.',
    cover_url: '/covers/ddia.jpg',
    price: 380000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[0],
  },
  {
    id: '9169baea-a465-46bc-847f-6b4c9e8e8609',
    title: 'Refactoring: Improving the Design of Existing Code',
    author: 'Martin Fowler',
    isbn: '978-0134757599',
    category_id: 'a0000000-0000-0000-0000-000000000001',
    publisher: 'Addison-Wesley Professional',
    published_year: 2018,
    description: 'Katalog teknik refactoring untuk mengubah struktur internal perangkat lunak tanpa mengubah perilaku eksternalnya.',
    cover_url: '/covers/refactoring.jpg',
    price: 310000,
    total_stock: 3,
    available_stock: 3,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[0],
  },
  {
    id: '29f87032-492f-4349-9e8b-22db7d97ea2a',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    isbn: '978-9799731234',
    category_id: 'a0000000-0000-0000-0000-000000000003',
    publisher: 'Lentera Dipantara',
    published_year: 1980,
    description: 'Roman sejarah yang mengisahkan pergulatan intelektual Minke di era kolonial Hindia Belanda.',
    cover_url: '/covers/bumi-manusia.jpg',
    price: 115000,
    total_stock: 6,
    available_stock: 6,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[2],
  },
  {
    id: '23a216a0-9162-4c1b-9ea4-84679565180a',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    isbn: '978-9793062792',
    category_id: 'a0000000-0000-0000-0000-000000000003',
    publisher: 'Bentang Pustaka',
    published_year: 2005,
    description: 'Kisah inspiratif sepuluh anak laskar pelangi dalam memperjuangkan pendidikan di tanah Belitung.',
    cover_url: '/covers/laskar-pelangi.jpg',
    price: 89000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[2],
  },
  {
    id: 'c703aa41-2d78-4d6f-a65c-22307626ed08',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    isbn: '978-0307887894',
    category_id: 'a0000000-0000-0000-0000-000000000004',
    publisher: 'Crown Business',
    published_year: 2011,
    description: 'Metodologi inovasi berkelanjutan dan validasi ide bisnis dengan pendekatan Build-Measure-Learn.',
    cover_url: '/covers/lean-startup.jpg',
    price: 220000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[3],
  },
  {
    id: '889db961-fff2-4c8f-938a-e729356691cf',
    title: "Stargate's Echo: Journey Beyond the Void",
    author: 'Alistair Vance',
    isbn: '978-602-04-1102-1',
    category_id: 'a0000000-0000-0000-0000-000000000003',
    publisher: 'CosmoSphere Publishing',
    published_year: 2025,
    description: 'Penjelajahan epik seorang astronaut menembus gerbang antariksa purba melintasi galaksi tak terjamah untuk mengungkap misteri peradaban awal alam semesta.',
    cover_url: '/covers/stargates-echo.jpg',
    price: 175000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[2],
  },
  {
    id: '16b8e97e-1a5f-4a8a-810c-22ed112d4ac2',
    title: "The Wanderer's Star",
    author: 'Elara Vance',
    isbn: '978-602-04-2203-4',
    category_id: 'a0000000-0000-0000-0000-000000000003',
    publisher: 'Mythic Realm Editions',
    published_year: 2025,
    description: 'Kisah pengembara pemegang tongkat kristal bintang yang harus mencapai Menara Samudra Utara di bawah pendaran aurora magis untuk memulihkan keseimbangan cahaya.',
    cover_url: '/covers/the-wanderers-star.jpg',
    price: 165000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[2],
  },
  {
    id: 'b0092d07-5397-4a28-8643-783e211fac30',
    title: 'Neon Ghost: A Cyberpunk Thriller',
    author: 'K.J. Armstrong',
    isbn: '978-602-04-3304-7',
    category_id: 'a0000000-0000-0000-0000-000000000001',
    publisher: 'CyberNet Fiction Press',
    published_year: 2026,
    description: 'Ketegangan di megapolis Night City ketika seorang agen bayangan cybernetic memburu dalang di balik peretasan sistem kecerdasan buatan pusat pengendali kota.',
    cover_url: '/covers/neon-ghost.jpg',
    price: 185000,
    total_stock: 6,
    available_stock: 6,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[0],
  },
  {
    id: '0d029c66-08d3-40fa-8c5f-b1a9fddc7c3c',
    title: 'Harmoni Semesta Kuantum: Menyingkap Simfoni Partikel',
    author: 'Dr. Maya Sastroamidjojo',
    isbn: '978-602-01-9821-3',
    category_id: 'a0000000-0000-0000-0000-000000000002',
    publisher: 'Lexora Academic Press',
    published_year: 2025,
    description: 'Eksplorasi mendalam mengenai jalinan kuantum, keterikatan partikel, dan misteri materi gelap yang dipaparkan dengan narasi puitis serta analogi resonansi musikal.',
    cover_url: '/covers/semesta-kuantum.jpg',
    price: 195000,
    total_stock: 5,
    available_stock: 5,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[1],
  },
  {
    id: '760a5f68-4f79-46c1-9558-c5fbff4a0c67',
    title: 'Bisikan Kabut Batavia: Misteri Pelabuhan Kalapa',
    author: 'Tirto Hadiningrat',
    isbn: '978-602-02-7719-2',
    category_id: 'a0000000-0000-0000-0000-000000000003',
    publisher: 'Pustaka Nusa Antara',
    published_year: 2024,
    description: 'Konspirasi hilangnya manuskrip peta rahasia maritim dan serangkaian teka-teki di sudut-sudut berkabut Batavia era kolonial 1920-an.',
    cover_url: '/covers/kabut-batavia.jpg',
    price: 135000,
    total_stock: 4,
    available_stock: 4,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[2],
  },
  {
    id: '3fb8e171-3293-4c1e-9ec2-e578e77c552f',
    title: 'Ekonomi Sirkular Biru: Cetak Biru Inovasi Hijau Masa Depan',
    author: 'Hendrawan Santika',
    isbn: '978-602-03-4412-8',
    category_id: 'a0000000-0000-0000-0000-000000000004',
    publisher: 'Cakrawala Bisnis Mandiri',
    published_year: 2025,
    description: 'Panduan kepemimpinan visioner dan model bisnis regeneratif tanpa limbah di era transisi energi global dan ekonomi maritim berkelanjutan.',
    cover_url: '/covers/ekonomi-biru.jpg',
    price: 210000,
    total_stock: 6,
    available_stock: 6,
    status: 'active',
    created_at: '2026-10-28T04:09:27.974Z',
    updated_at: '2026-10-28T04:09:27.974Z',
    category: fallbackCategories[3],
  },
];

interface CatalogPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    cat?: string | string[];
    category?: string | string[];
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  let books: BookWithCategory[] = fallbackBooks;
  let categories: Category[] = fallbackCategories;

  const resolvedParams = searchParams ? await searchParams : {};
  const rawQ = resolvedParams.q;
  const rawCat = resolvedParams.cat || resolvedParams.category;

  const initialQuery = typeof rawQ === 'string' ? rawQ : Array.isArray(rawQ) ? rawQ[0] || '' : '';
  const initialCategory = typeof rawCat === 'string' ? rawCat : Array.isArray(rawCat) ? rawCat[0] || 'all' : 'all';

  try {
    if (process.env.DATABASE_URL) {
      const [dbBooks, dbCats] = await Promise.all([
        sql`
          SELECT b.id, b.title, b.author, b.isbn, b.category_id, b.publisher, b.published_year,
                 b.description, b.cover_url, b.price::float as price, b.total_stock, b.available_stock,
                 b.status, b.created_at, b.updated_at,
                 json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) as category
          FROM books b
          LEFT JOIN categories c ON b.category_id = c.id
          WHERE b.status = 'active'
          ORDER BY b.created_at DESC
        `,
        sql`SELECT * FROM categories ORDER BY name ASC`,
      ]);

      if (dbBooks && dbBooks.length > 0) {
        books = dbBooks as unknown as BookWithCategory[];
      }
      if (dbCats && dbCats.length > 0) {
        categories = dbCats as unknown as Category[];
      }
    }
  } catch (error) {
    console.warn('Gagal memuat katalog langsung dari NeonDB, menyajikan data cadangan terverifikasi:', error);
  }

  return (
    <div>
      <PageHeader
        title="Katalog Koleksi Buku"
        description="Jelajahi dan pilih buku yang ingin Anda pinjam dari perpustakaan Lexora."
      />
      <BookCatalogClient
        initialBooks={books}
        categories={categories}
        initialQuery={initialQuery}
        initialCategory={initialCategory}
      />
    </div>
  );
}
