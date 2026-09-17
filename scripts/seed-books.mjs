import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const client = createClient(supabaseUrl, serviceKey);

const newBooks = [
  {
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
    status: 'active'
  },
  {
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
    status: 'active'
  },
  {
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
    status: 'active'
  },
  {
    title: 'Harmoni Semesta Kuantum: Menyingkap Simfoni Partikel',
    author: 'Dr. Maya Sastroamidjojo',
    isbn: '978-602-01-9821-3',
    category_id: 'a0000000-0000-0000-0000-000000000002',
    publisher: 'Lexora Academic Press',
    published_year: 2025,
    description: 'Eksplorasi mendalam mengenai jalinan kuantum, keterikatan partikel, dan misteri materi gelap yang dipaparkan dengan narasi puitis serta analogi resonansi musikal.',
    cover_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    price: 195000,
    total_stock: 5,
    available_stock: 5,
    status: 'active'
  },
  {
    title: 'Bisikan Kabut Batavia: Misteri Pelabuhan Kalapa',
    author: 'Tirto Hadiningrat',
    isbn: '978-602-02-7719-2',
    category_id: 'a0000000-0000-0000-0000-000000000003',
    publisher: 'Pustaka Nusa Antara',
    published_year: 2024,
    description: 'Konspirasi hilangnya manuskrip peta rahasia maritim dan serangkaian teka-teki di sudut-sudut berkabut Batavia era kolonial 1920-an.',
    cover_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    price: 135000,
    total_stock: 4,
    available_stock: 4,
    status: 'active'
  },
  {
    title: 'Ekonomi Sirkular Biru: Cetak Biru Inovasi Hijau Masa Depan',
    author: 'Hendrawan Santika',
    isbn: '978-602-03-4412-8',
    category_id: 'a0000000-0000-0000-0000-000000000004',
    publisher: 'Cakrawala Bisnis Mandiri',
    published_year: 2025,
    description: 'Panduan kepemimpinan visioner dan model bisnis regeneratif tanpa limbah di era transisi energi global dan ekonomi maritim berkelanjutan.',
    cover_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    price: 210000,
    total_stock: 6,
    available_stock: 6,
    status: 'active'
  }
];

async function main() {
  console.log('Seeding new fictional books into Supabase...');
  for (const book of newBooks) {
    const { error } = await client.from('books').upsert(book, { onConflict: 'isbn' });
    if (error) {
      console.error(`Error inserting ${book.title}:`, error.message);
    } else {
      console.log(`✓ Added: ${book.title} (${book.author})`);
    }
  }

  const { count } = await client.from('books').select('*', { count: 'exact', head: true });
  console.log(`\n🎉 Total buku sekarang di katalog: ${count} buku.`);
}

main();
