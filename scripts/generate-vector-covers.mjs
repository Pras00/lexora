import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public/covers');

// 1. Harmoni Semesta Kuantum (Quantum physics aesthetic: deep navy, gold rings, particle waves)
const svgKuantum = `
<svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="60%" stop-color="#090d1f" />
      <stop offset="100%" stop-color="#02040a" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#bgGlow)" />

  <!-- Outer frame border -->
  <rect x="30" y="30" width="740" height="1140" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.4" />
  <rect x="40" y="40" width="720" height="1120" fill="none" stroke="url(#goldGrad)" stroke-width="0.75" opacity="0.2" />

  <!-- Quantum rings / orbitals -->
  <g transform="translate(400, 480)" opacity="0.85">
    <ellipse rx="220" ry="80" fill="none" stroke="url(#goldGrad)" stroke-width="2" transform="rotate(-30)" />
    <ellipse rx="220" ry="80" fill="none" stroke="url(#cyanGrad)" stroke-width="1.8" transform="rotate(30)" />
    <ellipse rx="220" ry="80" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" transform="rotate(90)" />
    <circle r="40" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="3" />
    <circle r="16" fill="url(#goldGrad)" />
    <!-- Floating quantum particles -->
    <circle cx="120" cy="-60" r="6" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
    <circle cx="-140" cy="50" r="5" fill="#fef08a" filter="drop-shadow(0 0 6px #fef08a)" />
    <circle cx="-70" cy="-110" r="4" fill="#818cf8" />
    <circle cx="80" cy="110" r="4.5" fill="#ca8a04" />
  </g>

  <!-- Publisher Tag -->
  <text x="400" y="100" font-family="sans-serif" font-size="14" font-weight="600" fill="#94a3b8" letter-spacing="6" text-anchor="middle">LEXORA ACADEMIC MONOGRAPH</text>

  <!-- Book Title -->
  <text x="400" y="760" font-family="serif" font-size="46" font-weight="700" fill="#ffffff" letter-spacing="2" text-anchor="middle">HARMONI</text>
  <text x="400" y="825" font-family="serif" font-size="42" font-weight="700" fill="url(#goldGrad)" letter-spacing="3" text-anchor="middle">SEMESTA KUANTUM</text>

  <!-- Subtitle -->
  <line x1="280" y1="870" x2="520" y2="870" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6" />
  <text x="400" y="910" font-family="sans-serif" font-size="16" font-weight="300" fill="#cbd5e1" letter-spacing="2" text-anchor="middle">Menyingkap Simfoni Partikel di Ujung Realitas</text>

  <!-- Author -->
  <text x="400" y="1060" font-family="sans-serif" font-size="20" font-weight="600" fill="#f8fafc" letter-spacing="3" text-anchor="middle">DR. MAYA SASTROAMIDJOJO</text>
  <text x="400" y="1090" font-family="sans-serif" font-size="13" font-weight="400" fill="#64748b" letter-spacing="1" text-anchor="middle">GURU BESAR FISIKA TEORITIS</text>
</svg>
`;

// 2. Bisikan Kabut Batavia (Historical noir: dark charcoal, amber gas lamp glow, harbor silhouette)
const svgBatavia = `
<svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="lanternGlow" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#451a03" />
      <stop offset="50%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </radialGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7" />
      <stop offset="40%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#lanternGlow)" />

  <!-- Fog & texture lines -->
  <path d="M0 450 Q 200 420, 400 460 T 800 440 L 800 1200 L 0 1200 Z" fill="#171412" opacity="0.8" />
  <path d="M0 580 Q 250 540, 500 590 T 800 560 L 800 1200 L 0 1200 Z" fill="#0c0a09" opacity="0.9" />

  <!-- Ornate classic borders -->
  <rect x="35" y="35" width="730" height="1130" fill="none" stroke="#d97706" stroke-width="2" opacity="0.4" />
  <rect x="45" y="45" width="710" height="1110" fill="none" stroke="#d97706" stroke-width="0.8" opacity="0.2" />

  <!-- Lantern Icon & Light Rays -->
  <g transform="translate(400, 360)">
    <circle r="90" fill="#f59e0b" opacity="0.15" />
    <circle r="50" fill="#fbbf24" opacity="0.25" />
    <polygon points="0,-70 25,-40 25,40 0,60 -25,40 -25,-40" fill="none" stroke="#d97706" stroke-width="3" />
    <circle r="14" fill="#fef08a" />
    <!-- Ship masts in fog behind -->
    <line x1="-160" y1="-120" x2="-160" y2="80" stroke="#44403c" stroke-width="3" opacity="0.6" />
    <line x1="-200" y1="-70" x2="-120" y2="-70" stroke="#44403c" stroke-width="2" opacity="0.6" />
    <line x1="160" y1="-100" x2="160" y2="80" stroke="#44403c" stroke-width="2.5" opacity="0.5" />
    <line x1="130" y1="-50" x2="190" y2="-50" stroke="#44403c" stroke-width="1.8" opacity="0.5" />
  </g>

  <!-- Tagline -->
  <text x="400" y="110" font-family="serif" font-size="14" fill="#a8a29e" letter-spacing="5" text-anchor="middle">SEBUAH NOVEL MISTERI SEJARAH</text>

  <!-- Title -->
  <text x="400" y="680" font-family="serif" font-size="44" font-weight="700" fill="#fef3c7" letter-spacing="4" text-anchor="middle">BISIKAN KABUT</text>
  <text x="400" y="745" font-family="serif" font-size="52" font-weight="800" fill="url(#amberGrad)" letter-spacing="6" text-anchor="middle">BATAVIA</text>

  <!-- Subtitle -->
  <line x1="260" y1="785" x2="540" y2="785" stroke="#d97706" stroke-width="1.5" opacity="0.6" />
  <text x="400" y="825" font-family="serif" font-size="17" font-style="italic" fill="#e7e5e4" letter-spacing="2" text-anchor="middle">Misteri Manuskrip Berdarah Pelabuhan Kalapa 1920</text>

  <!-- Author -->
  <text x="400" y="1040" font-family="serif" font-size="24" font-weight="600" fill="#fafaf9" letter-spacing="3" text-anchor="middle">TIRTO HADININGRAT</text>
  <text x="400" y="1080" font-family="sans-serif" font-size="12" fill="#78716c" letter-spacing="2" text-anchor="middle">PENERBIT PUSTAKA NUSA ANTARA</text>
</svg>
`;

// 3. Ekonomi Sirkular Biru (Eco leadership & modern business: emerald/cyan gradient, geometric eco-loops)
const svgEkonomi = `
<svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ecoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22" />
      <stop offset="50%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="1200" fill="url(#ecoBg)" />

  <!-- Geometric Grid & Modern Architecture Lines -->
  <line x1="40" y1="40" x2="760" y2="40" stroke="#34d399" stroke-width="1.5" opacity="0.3" />
  <line x1="40" y1="1160" x2="760" y2="1160" stroke="#34d399" stroke-width="1.5" opacity="0.3" />

  <!-- Circular loop geometry (Infinity / Circular Economy symbol) -->
  <g transform="translate(400, 420)">
    <path d="M-130,0 C-130,-90 0,-90 0,0 C0,90 130,90 130,0 C130,-90 0,-90 0,0 C0,90 -130,90 -130,0 Z" 
          fill="none" stroke="url(#emeraldGrad)" stroke-width="16" stroke-linecap="round" />
    <circle cx="0" cy="0" r="8" fill="#34d399" />
    <!-- Radiating eco grid circles -->
    <circle r="180" fill="none" stroke="#10b981" stroke-width="1" opacity="0.2" stroke-dasharray="8 8" />
  </g>

  <!-- Header Category -->
  <text x="400" y="120" font-family="sans-serif" font-size="13" font-weight="700" fill="#34d399" letter-spacing="5" text-anchor="middle">STRATEGI BISNIS &amp; INOVASI MASA DEPAN</text>

  <!-- Title -->
  <text x="400" y="700" font-family="sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="3" text-anchor="middle">EKONOMI</text>
  <text x="400" y="760" font-family="sans-serif" font-size="48" font-weight="900" fill="url(#emeraldGrad)" letter-spacing="4" text-anchor="middle">SIRKULAR BIRU</text>

  <!-- Subtitle -->
  <text x="400" y="825" font-family="sans-serif" font-size="16" font-weight="400" fill="#99f6e4" letter-spacing="2" text-anchor="middle">Cetak Biru Inovasi Hijau &amp; Regenerasi Industri</text>

  <!-- Endorsement Badge -->
  <rect x="220" y="880" width="360" height="42" rx="21" fill="#042f2e" stroke="#10b981" stroke-width="1" />
  <text x="400" y="906" font-family="sans-serif" font-size="12" font-weight="600" fill="#a7f3d0" letter-spacing="2" text-anchor="middle">INTERNATIONAL BESTSELLER IN SUSTAINABILITY</text>

  <!-- Author -->
  <text x="400" y="1050" font-family="sans-serif" font-size="22" font-weight="700" fill="#f0fdf4" letter-spacing="2" text-anchor="middle">HENDRAWAN SANTIKA</text>
  <text x="400" y="1080" font-family="sans-serif" font-size="13" font-weight="400" fill="#6ee7b7" letter-spacing="1" text-anchor="middle">PRAKTISI EKONOMI SIRKULAR NASIONAL</text>
</svg>
`;

async function renderCovers() {
  console.log('Rendering high-resolution vector book covers...');
  await sharp(Buffer.from(svgKuantum)).jpeg({ quality: 95 }).toFile(path.join(outDir, 'semesta-kuantum.jpg'));
  console.log('✓ semesta-kuantum.jpg generated');

  await sharp(Buffer.from(svgBatavia)).jpeg({ quality: 95 }).toFile(path.join(outDir, 'kabut-batavia.jpg'));
  console.log('✓ kabut-batavia.jpg generated');

  await sharp(Buffer.from(svgEkonomi)).jpeg({ quality: 95 }).toFile(path.join(outDir, 'ekonomi-biru.jpg'));
  console.log('✓ ekonomi-biru.jpg generated');

  console.log('\nAll custom covers rendered successfully to public/covers/ !');
}

renderCovers();
