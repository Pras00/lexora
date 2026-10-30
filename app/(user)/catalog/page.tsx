import { sql } from '@/lib/db/neon';
import { PageHeader } from '@/components/shared/PageHeader';
import { BookCatalogClient } from '@/components/books/BookCatalogClient';
import { BookWithCategory, Category } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fallback kategori lengkap dari NeonDB
const fallbackCategories: Category[] = [
  {
    "id": "a0000000-0000-0000-0000-000000000004",
    "name": "Bisnis & Manajemen",
    "slug": "bisnis-manajemen",
    "description": "Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.",
    "created_at": "2026-10-28T04:09:27.974Z"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000003",
    "name": "Fiksi & Sastra",
    "slug": "fiksi-sastra",
    "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
    "created_at": "2026-10-28T04:09:27.974Z"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000005",
    "name": "Pengembangan Diri",
    "slug": "pengembangan-diri",
    "description": "Buku motivasi, pembentukan kebiasaan, stoikisme, dan psikologi terapan.",
    "created_at": "2026-10-30T02:44:51.063Z"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000002",
    "name": "Sains & Matematika",
    "slug": "sains-matematika",
    "description": "Buku ilmu pengetahuan alam, fisika, biologi, dan matematika murni.",
    "created_at": "2026-10-28T04:09:27.974Z"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000006",
    "name": "Sejarah & Humaniora",
    "slug": "sejarah-humaniora",
    "description": "Karya sejarah peradaban, antropologi sosial, dan telaah budaya dunia.",
    "created_at": "2026-10-30T02:44:51.237Z"
  },
  {
    "id": "a0000000-0000-0000-0000-000000000001",
    "name": "Teknologi & Pemrograman",
    "slug": "teknologi-pemrograman",
    "description": "Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.",
    "created_at": "2026-10-28T04:09:27.974Z"
  }
];

// Fallback 28 buku lengkap dengan cover lokal (/covers/*.jpg) yang tersedia di public/covers/
const fallbackBooks: BookWithCategory[] = [
  {
    "id": "a5d4355c-7f88-45eb-ade0-30aedad24c4d",
    "title": "Zero to One: Catatan tentang Startup & Membangun Masa Depan",
    "author": "Peter Thiel",
    "isbn": "978-602-03-1259-0",
    "category_id": "a0000000-0000-0000-0000-000000000004",
    "publisher": "Gramedia Pustaka Utama",
    "published_year": 2015,
    "description": "Filosofi revolusioner membangun inovasi vertikal dari 0 ke 1, menciptakan produk yang belum pernah ada, dan memonopoli nilai baru.",
    "cover_url": "/covers/zero-to-one.jpg",
    "price": 110000,
    "total_stock": 6,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-30T02:44:52.123Z",
    "updated_at": "2026-10-30T02:44:52.123Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000004",
      "name": "Bisnis & Manajemen",
      "slug": "bisnis-manajemen",
      "description": "Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "556ba8f3-a7ca-47d2-bbc6-67d650ab323f",
    "title": "The Pragmatic Programmer: Your Journey to Mastery",
    "author": "David Thomas, Andrew Hunt",
    "isbn": "978-0135957059",
    "category_id": "a0000000-0000-0000-0000-000000000001",
    "publisher": "Addison-Wesley Professional",
    "published_year": 2019,
    "description": "Panduan praktis esensial tentang pola pikir rekayasa perangkat lunak, kebiasaan profesional, dan ketahanan arsitektur kode modern.",
    "cover_url": "/covers/pragmatic-programmer.jpg",
    "price": 320000,
    "total_stock": 5,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-30T02:44:52.046Z",
    "updated_at": "2026-10-30T02:44:52.046Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000001",
      "name": "Teknologi & Pemrograman",
      "slug": "teknologi-pemrograman",
      "description": "Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "5e8f4743-a7f1-4425-b1b0-73461772ab62",
    "title": "Thinking, Fast and Slow: Berpikir Cepat dan Lambat",
    "author": "Daniel Kahneman",
    "isbn": "978-602-06-3183-7",
    "category_id": "a0000000-0000-0000-0000-000000000002",
    "publisher": "Gramedia Pustaka Utama",
    "published_year": 2019,
    "description": "Teori peraih Nobel Ekonomi tentang dua sistem yang mengendalikan cara pikir manusia: Sistem 1 yang intuitif dan Sistem 2 yang analitis.",
    "cover_url": "/covers/thinking-fast-slow.jpg",
    "price": 175000,
    "total_stock": 4,
    "available_stock": 2,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.967Z",
    "updated_at": "2026-10-30T02:44:51.967Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000002",
      "name": "Sains & Matematika",
      "slug": "sains-matematika",
      "description": "Buku ilmu pengetahuan alam, fisika, biologi, dan matematika murni.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "785130fd-f138-428c-9d99-f7157d7e8524",
    "title": "Kosmos (Cosmos)",
    "author": "Carl Sagan",
    "isbn": "978-602-424-230-5",
    "category_id": "a0000000-0000-0000-0000-000000000002",
    "publisher": "Kepustakaan Populer Gramedia",
    "published_year": 2016,
    "description": "Mahakarya literatur ilmiah tentang petualangan 15 miliar tahun evolusi kosmik, penjelajahan bintang, dan pemahaman tempat manusia di alam semesta.",
    "cover_url": "/covers/kosmos.jpg",
    "price": 150000,
    "total_stock": 5,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.924Z",
    "updated_at": "2026-10-30T02:44:51.924Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000002",
      "name": "Sains & Matematika",
      "slug": "sains-matematika",
      "description": "Buku ilmu pengetahuan alam, fisika, biologi, dan matematika murni.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "e7432981-41a3-4955-b58e-9b26215ea922",
    "title": "Nusantara: Sejarah Indonesia",
    "author": "Bernard H.M. Vlekke",
    "isbn": "978-602-424-699-0",
    "category_id": "a0000000-0000-0000-0000-000000000006",
    "publisher": "Kepustakaan Populer Gramedia",
    "published_year": 2022,
    "description": "Rujukan historis klasik terlengkap mengenai perjalanan politik, perdagangan rempah, dan kebudayaan maritim Nusantara sejak zaman kuno.",
    "cover_url": "/covers/nusantara.jpg",
    "price": 140000,
    "total_stock": 4,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.846Z",
    "updated_at": "2026-10-30T02:44:51.846Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000006",
      "name": "Sejarah & Humaniora",
      "slug": "sejarah-humaniora",
      "description": "Karya sejarah peradaban, antropologi sosial, dan telaah budaya dunia.",
      "created_at": "2026-10-30T02:44:51.237Z"
    }
  },
  {
    "id": "36cc57b5-e7a4-483b-9482-f0d10f58c5ff",
    "title": "Guns, Germs, and Steel: Bedil, Kuman, dan Baja",
    "author": "Jared Diamond",
    "isbn": "978-979-91-0611-7",
    "category_id": "a0000000-0000-0000-0000-000000000006",
    "publisher": "Kepustakaan Populer Gramedia",
    "published_year": 2014,
    "description": "Analisis brilian mengapa peradaban benua tertentu berkembang lebih pesat dibanding yang lain ditinjau dari faktor geografis dan lingkungan.",
    "cover_url": "/covers/guns-germs-steel.jpg",
    "price": 155000,
    "total_stock": 4,
    "available_stock": 2,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.789Z",
    "updated_at": "2026-10-30T02:44:51.789Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000006",
      "name": "Sejarah & Humaniora",
      "slug": "sejarah-humaniora",
      "description": "Karya sejarah peradaban, antropologi sosial, dan telaah budaya dunia.",
      "created_at": "2026-10-30T02:44:51.237Z"
    }
  },
  {
    "id": "42d7007b-d3a3-4f76-8b3b-41bbd679ae02",
    "title": "Sapiens: Riwayat Singkat Umat Manusia",
    "author": "Yuval Noah Harari",
    "isbn": "978-602-424-416-3",
    "category_id": "a0000000-0000-0000-0000-000000000006",
    "publisher": "Kepustakaan Populer Gramedia",
    "published_year": 2017,
    "description": "Penelusuran menyeluruh tentang evolusi spesies Homo sapiens dari pemburu-peramu tak berarti hingga menjadi penguasa planet bumi.",
    "cover_url": "/covers/sapiens.jpg",
    "price": 165000,
    "total_stock": 5,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.735Z",
    "updated_at": "2026-10-30T02:44:51.735Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000006",
      "name": "Sejarah & Humaniora",
      "slug": "sejarah-humaniora",
      "description": "Karya sejarah peradaban, antropologi sosial, dan telaah budaya dunia.",
      "created_at": "2026-10-30T02:44:51.237Z"
    }
  },
  {
    "id": "c6929284-f1a6-4c98-8971-7ef502b0665c",
    "title": "The Psychology of Money: Uang, Kepalsuan & Kebahagiaan",
    "author": "Morgan Housel",
    "isbn": "978-602-6486-53-0",
    "category_id": "a0000000-0000-0000-0000-000000000004",
    "publisher": "Penerbit Baca",
    "published_year": 2021,
    "description": "19 cerita pendek menyingkap cara unik manusia memperlakukan uang serta bagaimana perilaku dan psikologi menentukan kesuksesan finansial.",
    "cover_url": "/covers/psychology-of-money.jpg",
    "price": 125000,
    "total_stock": 6,
    "available_stock": 5,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.698Z",
    "updated_at": "2026-10-30T02:44:51.698Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000004",
      "name": "Bisnis & Manajemen",
      "slug": "bisnis-manajemen",
      "description": "Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "65cfdc8a-c304-4f01-921c-47c1cedc356b",
    "title": "Sebuah Seni untuk Bersikap Bodo Amat",
    "author": "Mark Manson",
    "isbn": "978-602-452-698-6",
    "category_id": "a0000000-0000-0000-0000-000000000005",
    "publisher": "Grasindo",
    "published_year": 2018,
    "description": "Pendekatan jujur dan realistis tanpa basa-basi tentang menerima keterbatasan hidup dan hanya memedulikan hal-hal yang benar-benar bermakna.",
    "cover_url": "/covers/bodo-amat.jpg",
    "price": 95000,
    "total_stock": 6,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.670Z",
    "updated_at": "2026-10-30T02:44:51.670Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000005",
      "name": "Pengembangan Diri",
      "slug": "pengembangan-diri",
      "description": "Buku motivasi, pembentukan kebiasaan, stoikisme, dan psikologi terapan.",
      "created_at": "2026-10-30T02:44:51.063Z"
    }
  },
  {
    "id": "b0bf6ec6-6fc2-4f19-8ac0-06aa1796cdb8",
    "title": "Filosofi Teras: Panduan Stoikisme Khas Mental Tangguh",
    "author": "Henry Manampiring",
    "isbn": "978-602-412-518-9",
    "category_id": "a0000000-0000-0000-0000-000000000005",
    "publisher": "Penerbit Buku Kompas",
    "published_year": 2019,
    "description": "Penerapan filsafat Stoa kuno untuk mengatasi kekhawatiran berlebih, emosi negatif, dan membangun ketenangan batin generasi masa kini.",
    "cover_url": "/covers/filosofi-teras.jpg",
    "price": 108000,
    "total_stock": 7,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.614Z",
    "updated_at": "2026-10-30T02:44:51.614Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000005",
      "name": "Pengembangan Diri",
      "slug": "pengembangan-diri",
      "description": "Buku motivasi, pembentukan kebiasaan, stoikisme, dan psikologi terapan.",
      "created_at": "2026-10-30T02:44:51.063Z"
    }
  },
  {
    "id": "c6389430-bc55-4a4e-ad17-e63543aff9c0",
    "title": "Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa",
    "author": "James Clear",
    "isbn": "978-602-06-3317-6",
    "category_id": "a0000000-0000-0000-0000-000000000005",
    "publisher": "Gramedia Pustaka Utama",
    "published_year": 2019,
    "description": "Kerangka praktis berbasis sains perilaku untuk membangun kebiasaan baik dan meruntuhkan kebiasaan buruk secara bertahap melalui sistem 1 persen.",
    "cover_url": "/covers/atomic-habits.jpg",
    "price": 118000,
    "total_stock": 8,
    "available_stock": 6,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.580Z",
    "updated_at": "2026-10-30T02:44:51.580Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000005",
      "name": "Pengembangan Diri",
      "slug": "pengembangan-diri",
      "description": "Buku motivasi, pembentukan kebiasaan, stoikisme, dan psikologi terapan.",
      "created_at": "2026-10-30T02:44:51.063Z"
    }
  },
  {
    "id": "1a5105b7-738f-4b85-842e-8ff908c92575",
    "title": "Gadis Kretek",
    "author": "Ratih Kumala",
    "isbn": "978-979-22-8141-5",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Gramedia Pustaka Utama",
    "published_year": 2012,
    "description": "Misteri pencarian Jeng Yah, peracik saus rokok kretek legendaris yang menyimpan kisah asmara dan persaingan bisnis tembakau di Jawa era 1960-an.",
    "cover_url": "/covers/gadis-kretek.jpg",
    "price": 95000,
    "total_stock": 5,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.531Z",
    "updated_at": "2026-10-30T02:44:51.531Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "fd59e79a-2897-47e8-b832-bfacd1faf0bd",
    "title": "Cantik Itu Luka",
    "author": "Eka Kurniawan",
    "isbn": "978-602-03-1258-3",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Gramedia Pustaka Utama",
    "published_year": 2015,
    "description": "Roman realisme magis tentang Dewi Ayu dan putri-putrinya di kota fiktif Halimunda dengan latar sejarah kelam kolonialisme dan revolusi.",
    "cover_url": "/covers/cantik-itu-luka.jpg",
    "price": 130000,
    "total_stock": 4,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.462Z",
    "updated_at": "2026-10-30T02:44:51.462Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "40eff558-c8a0-4a83-82cf-85d06833de71",
    "title": "Laut Bercerita",
    "author": "Leila S. Chudori",
    "isbn": "978-602-424-694-5",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Kepustakaan Populer Gramedia",
    "published_year": 2017,
    "description": "Kisah Biru Laut dan kawan-kawan aktivis mahasiswa 1998 yang hilang diculik, serta penantian panjang keluarga yang tak kunjung padam.",
    "cover_url": "/covers/laut-bercerita.jpg",
    "price": 115000,
    "total_stock": 7,
    "available_stock": 5,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.413Z",
    "updated_at": "2026-10-30T02:44:51.413Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "a63bc2b2-a4a8-4756-be24-0ae5350b57bb",
    "title": "Harry Potter dan Batu Bertuah",
    "author": "J.K. Rowling",
    "isbn": "978-602-03-3474-5",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Gramedia Pustaka Utama",
    "published_year": 2017,
    "description": "Tahun pertama Harry Potter di Sekolah Sihir Hogwarts saat ia mengungkap konspirasi legendaris Batu Bertuah dan asal-usul takdirnya.",
    "cover_url": "/covers/harry-potter.jpg",
    "price": 145000,
    "total_stock": 5,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.366Z",
    "updated_at": "2026-10-30T02:44:51.366Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "8165a32c-6f69-4a9a-97a8-11ef9787dc42",
    "title": "Pulang - Pergi",
    "author": "Tere Liye",
    "isbn": "978-623-96031-8-2",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Sabak Grip Nusantara",
    "published_year": 2021,
    "description": "Pertarungan sengit antara keluarga shadow economy Bujang dan Thomas yang berlatar intrik kejahatan tingkat tinggi antarnegara.",
    "cover_url": "/covers/pulang-pergi.jpg",
    "price": 98000,
    "total_stock": 6,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-30T02:44:51.304Z",
    "updated_at": "2026-10-30T02:44:51.304Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "760a5f68-4f79-46c1-9558-c5fbff4a0c67",
    "title": "Bisikan Kabut Batavia: Misteri Pelabuhan Kalapa",
    "author": "Tirto Hadiningrat",
    "isbn": "978-602-02-7719-2",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Pustaka Nusa Antara",
    "published_year": 2024,
    "description": "Konspirasi hilangnya manuskrip peta rahasia maritim dan serangkaian teka-teki di sudut-sudut berkabut Batavia era kolonial 1920-an.",
    "cover_url": "/covers/kabut-batavia.jpg",
    "price": 135000,
    "total_stock": 4,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "0d029c66-08d3-40fa-8c5f-b1a9fddc7c3c",
    "title": "Harmoni Semesta Kuantum: Menyingkap Simfoni Partikel",
    "author": "Dr. Maya Sastroamidjojo",
    "isbn": "978-602-01-9821-3",
    "category_id": "a0000000-0000-0000-0000-000000000002",
    "publisher": "Lexora Academic Press",
    "published_year": 2025,
    "description": "Eksplorasi mendalam mengenai jalinan kuantum, keterikatan partikel, dan misteri materi gelap yang dipaparkan dengan narasi puitis serta analogi resonansi musikal.",
    "cover_url": "/covers/semesta-kuantum.jpg",
    "price": 195000,
    "total_stock": 5,
    "available_stock": 5,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000002",
      "name": "Sains & Matematika",
      "slug": "sains-matematika",
      "description": "Buku ilmu pengetahuan alam, fisika, biologi, dan matematika murni.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "b0092d07-5397-4a28-8643-783e211fac30",
    "title": "Neon Ghost: A Cyberpunk Thriller",
    "author": "K.J. Armstrong",
    "isbn": "978-602-04-3304-7",
    "category_id": "a0000000-0000-0000-0000-000000000001",
    "publisher": "CyberNet Fiction Press",
    "published_year": 2026,
    "description": "Ketegangan di megapolis Night City ketika seorang agen bayangan cybernetic memburu dalang di balik peretasan sistem kecerdasan buatan pusat pengendali kota.",
    "cover_url": "/covers/neon-ghost.jpg",
    "price": 185000,
    "total_stock": 6,
    "available_stock": 6,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000001",
      "name": "Teknologi & Pemrograman",
      "slug": "teknologi-pemrograman",
      "description": "Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "16b8e97e-1a5f-4a8a-810c-22ed112d4ac2",
    "title": "The Wanderer's Star",
    "author": "Elara Vance",
    "isbn": "978-602-04-2203-4",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Mythic Realm Editions",
    "published_year": 2025,
    "description": "Kisah pengembara pemegang tongkat kristal bintang yang harus mencapai Menara Samudra Utara di bawah pendaran aurora magis untuk memulihkan keseimbangan cahaya.",
    "cover_url": "/covers/the-wanderers-star.jpg",
    "price": 165000,
    "total_stock": 4,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "889db961-fff2-4c8f-938a-e729356691cf",
    "title": "Stargate's Echo: Journey Beyond the Void",
    "author": "Alistair Vance",
    "isbn": "978-602-04-1102-1",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "CosmoSphere Publishing",
    "published_year": 2025,
    "description": "Penjelajahan epik seorang astronaut menembus gerbang antariksa purba melintasi galaksi tak terjamah untuk mengungkap misteri peradaban awal alam semesta.",
    "cover_url": "/covers/stargates-echo.jpg",
    "price": 175000,
    "total_stock": 5,
    "available_stock": 5,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "c703aa41-2d78-4d6f-a65c-22307626ed08",
    "title": "The Lean Startup",
    "author": "Eric Ries",
    "isbn": "978-0307887894",
    "category_id": "a0000000-0000-0000-0000-000000000004",
    "publisher": "Crown Business",
    "published_year": 2011,
    "description": "Metodologi inovasi berkelanjutan dan validasi ide bisnis dengan pendekatan Build-Measure-Learn.",
    "cover_url": "/covers/lean-startup.jpg",
    "price": 220000,
    "total_stock": 4,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000004",
      "name": "Bisnis & Manajemen",
      "slug": "bisnis-manajemen",
      "description": "Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "23a216a0-9162-4c1b-9ea4-84679565180a",
    "title": "Laskar Pelangi",
    "author": "Andrea Hirata",
    "isbn": "978-9793062792",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Bentang Pustaka",
    "published_year": 2005,
    "description": "Kisah inspiratif sepuluh anak laskar pelangi dalam memperjuangkan pendidikan di tanah Belitung.",
    "cover_url": "/covers/laskar-pelangi.jpg",
    "price": 89000,
    "total_stock": 5,
    "available_stock": 5,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "29f87032-492f-4349-9e8b-22db7d97ea2a",
    "title": "Bumi Manusia",
    "author": "Pramoedya Ananta Toer",
    "isbn": "978-9799731234",
    "category_id": "a0000000-0000-0000-0000-000000000003",
    "publisher": "Lentera Dipantara",
    "published_year": 1980,
    "description": "Roman sejarah yang mengisahkan pergulatan intelektual Minke di era kolonial Hindia Belanda.",
    "cover_url": "/covers/bumi-manusia.jpg",
    "price": 115000,
    "total_stock": 6,
    "available_stock": 6,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000003",
      "name": "Fiksi & Sastra",
      "slug": "fiksi-sastra",
      "description": "Karya sastra klasik, novel, fiksi ilmiah, dan antologi cerita pendek.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "9169baea-a465-46bc-847f-6b4c9e8e8609",
    "title": "Refactoring: Improving the Design of Existing Code",
    "author": "Martin Fowler",
    "isbn": "978-0134757599",
    "category_id": "a0000000-0000-0000-0000-000000000001",
    "publisher": "Addison-Wesley Professional",
    "published_year": 2018,
    "description": "Katalog teknik refactoring untuk mengubah struktur internal perangkat lunak tanpa mengubah perilaku eksternalnya.",
    "cover_url": "/covers/refactoring.jpg",
    "price": 310000,
    "total_stock": 3,
    "available_stock": 3,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000001",
      "name": "Teknologi & Pemrograman",
      "slug": "teknologi-pemrograman",
      "description": "Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "a5e18e45-08ae-414f-b1a4-8a8c3931f2fe",
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "category_id": "a0000000-0000-0000-0000-000000000001",
    "publisher": "Prentice Hall",
    "published_year": 2008,
    "description": "Panduan legendaris tentang penulisan kode bersih, keterbacaan kode, dan refactoring untuk insinyur perangkat lunak profesional.",
    "cover_url": "/covers/clean-code.jpg",
    "price": 250000,
    "total_stock": 5,
    "available_stock": 5,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000001",
      "name": "Teknologi & Pemrograman",
      "slug": "teknologi-pemrograman",
      "description": "Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "9c823b56-de74-48fa-a1fc-a635695403e6",
    "title": "Designing Data-Intensive Applications",
    "author": "Martin Kleppmann",
    "isbn": "978-1449373320",
    "category_id": "a0000000-0000-0000-0000-000000000001",
    "publisher": "O'Reilly Media",
    "published_year": 2017,
    "description": "Prinsip komprehensif di balik arsitektur sistem terdistribusi, database reliabel, skalabilitas data, dan konsistensi transaksi.",
    "cover_url": "/covers/ddia.jpg",
    "price": 380000,
    "total_stock": 4,
    "available_stock": 4,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000001",
      "name": "Teknologi & Pemrograman",
      "slug": "teknologi-pemrograman",
      "description": "Buku-buku seputar rekayasa perangkat lunak, web development, dan AI.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  },
  {
    "id": "3fb8e171-3293-4c1e-9ec2-e578e77c552f",
    "title": "Ekonomi Sirkular Biru: Cetak Biru Inovasi Hijau Masa Depan",
    "author": "Hendrawan Santika",
    "isbn": "978-602-03-4412-8",
    "category_id": "a0000000-0000-0000-0000-000000000004",
    "publisher": "Cakrawala Bisnis Mandiri",
    "published_year": 2025,
    "description": "Panduan kepemimpinan visioner dan model bisnis regeneratif tanpa limbah di era transisi energi global dan ekonomi maritim berkelanjutan.",
    "cover_url": "/covers/ekonomi-biru.jpg",
    "price": 210000,
    "total_stock": 6,
    "available_stock": 6,
    "status": "active",
    "created_at": "2026-10-28T04:09:27.974Z",
    "updated_at": "2026-10-28T04:09:27.974Z",
    "category": {
      "id": "a0000000-0000-0000-0000-000000000004",
      "name": "Bisnis & Manajemen",
      "slug": "bisnis-manajemen",
      "description": "Panduan kewirausahaan, manajemen produk, kepemimpinan, dan finansial.",
      "created_at": "2026-10-28T04:09:27.974Z"
    }
  }
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
                 json_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'description', c.description, 'created_at', c.created_at) as category
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
