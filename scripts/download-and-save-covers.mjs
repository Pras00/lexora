import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outDir = path.resolve(process.cwd(), 'public/covers');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const coverSources = [
  {
    filename: 'pulang-pergi.jpg',
    urls: [
      'https://cdn.gramedia.com/uploads/items/pulang-pergi_tere_liye.jpeg',
      'https://diglib.sdmutual.sch.id/storage/pustaka_cetak/PC0004053.jpg',
    ],
  },
  {
    filename: 'harry-potter.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780747532743-L.jpg',
      'https://covers.openlibrary.org/b/id/10522031-L.jpg',
    ],
  },
  {
    filename: 'laut-bercerita.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9786024246945-L.jpg',
      'https://cdn.gramedia.com/uploads/items/9786024246945_Laut-Bercerita.jpg',
    ],
  },
  {
    filename: 'cantik-itu-luka.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780811223638-L.jpg',
      'https://covers.openlibrary.org/b/id/8315183-L.jpg',
    ],
  },
  {
    filename: 'gadis-kretek.jpg',
    urls: [
      'https://ebooks.gramedia.com/ebook-covers/6634/image_highres/GPU_GKRE2019MTH07GK.jpg',
      'https://upload.wikimedia.org/wikipedia/id/thumb/b/b2/Poster_Gadis_Kretek_%28seri_web%29.jpg/300px-Poster_Gadis_Kretek_%28seri_web%29.jpg',
    ],
  },
  {
    filename: 'atomic-habits.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
      'https://covers.openlibrary.org/b/id/12886417-L.jpg',
    ],
  },
  {
    filename: 'filosofi-teras.jpg',
    urls: [
      'https://cdn.gramedia.com/uploads/picture_meta/2023/11/27/kjf6cgigkomf6sy9o5qauu.jpg',
      'https://upload.wikimedia.org/wikipedia/id/f/ff/Filsafat-teras-5c6141eec112fe4c8123aeb2.jpg',
    ],
  },
  {
    filename: 'bodo-amat.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg',
      'https://covers.openlibrary.org/b/id/14588820-L.jpg',
    ],
  },
  {
    filename: 'psychology-of-money.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg',
      'https://covers.openlibrary.org/b/id/10574108-L.jpg',
    ],
  },
  {
    filename: 'sapiens.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
      'https://covers.openlibrary.org/b/id/8315185-L.jpg',
    ],
  },
  {
    filename: 'guns-germs-steel.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg',
      'https://covers.openlibrary.org/b/id/12857474-L.jpg',
    ],
  },
  {
    filename: 'nusantara.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9789799100122-L.jpg',
      'https://covers.openlibrary.org/b/id/13247019-L.jpg',
    ],
  },
  {
    filename: 'kosmos.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780345331359-L.jpg',
      'https://covers.openlibrary.org/b/id/12028687-L.jpg',
    ],
  },
  {
    filename: 'thinking-fast-slow.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
      'https://covers.openlibrary.org/b/id/12857488-L.jpg',
    ],
  },
  {
    filename: 'pragmatic-programmer.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg',
      'https://covers.openlibrary.org/b/id/9255566-L.jpg',
    ],
  },
  {
    filename: 'zero-to-one.jpg',
    urls: [
      'https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg',
      'https://covers.openlibrary.org/b/id/12857492-L.jpg',
    ],
  },
];

async function fetchBufferWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  } finally {
    clearTimeout(id);
  }
}

async function processCovers() {
  console.log('Downloading and optimizing 16 real book covers...');
  for (const item of coverSources) {
    const destPath = path.join(outDir, item.filename);
    let success = false;

    for (const url of item.urls) {
      try {
        console.log(`Fetching ${item.filename} from ${url}...`);
        const rawBuf = await fetchBufferWithTimeout(url);

        // Validasi ukuran buffer (> 2KB)
        if (rawBuf.length < 2000) {
          throw new Error('Image data too small or placeholder');
        }

        // Optimasi & standarisasi ukuran ke proporsi buku tajam menggunakan sharp
        await sharp(rawBuf)
          .resize(600, 900, {
            fit: 'cover',
            position: 'center',
          })
          .jpeg({ quality: 90, mozjpeg: true })
          .toFile(destPath);

        const stats = fs.statSync(destPath);
        console.log(`✓ ${item.filename} saved successfully (${Math.round(stats.size / 1024)} KB)`);
        success = true;
        break;
      } catch (err) {
        console.warn(`  ↳ Failed with ${url}: ${err.message}`);
      }
    }

    if (!success) {
      console.error(`✗ FAILED to download any source for ${item.filename}`);
    }
  }
}

processCovers();

