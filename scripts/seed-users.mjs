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
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

const anonClient = createClient(supabaseUrl, anonKey);
const adminClient = createClient(supabaseUrl, serviceKey);

async function testUser(email, password, role) {
  console.log(`\nTesting login for: ${email}...`);
  const { data, error } = await anonClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(`❌ Gagal login sebagai ${email}:`, error.message);
    return false;
  }

  console.log(`✅ Berhasil login sebagai ${email}! (UID: ${data.user.id})`);

  // Fetch profile
  const { data: profile, error: profError } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profError) {
    console.warn(`⚠️ Warning profile:`, profError.message);
  } else {
    console.log(`   Nama: ${profile.full_name}, Role: ${profile.role}, No Anggota: ${profile.member_number}`);
  }

  await anonClient.auth.signOut();
  return true;
}

async function run() {
  console.log('=== VERIFIKASI AKUN LEXORA ===');
  const adminOk = await testUser('admin@lexora.id', 'admin12345', 'admin');
  const memberOk = await testUser('member@lexora.id', 'member12345', 'member');

  if (adminOk && memberOk) {
    console.log('\n🎉 SEMUA AKUN BERFUNGSI DENGAN SEMPURNA! Siap digunakan di web browser.');
  } else {
    console.log('\n⚠️ Beberapa akun belum bisa login. Pastikan skrip supabase/test_users.sql sudah dijalankan di SQL Editor Supabase.');
  }
}

run();
