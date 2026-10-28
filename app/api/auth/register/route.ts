import { NextResponse, type NextRequest } from 'next/server';
import { sql } from '@/lib/db/neon';
import { registerSchema } from '@/lib/validations/auth.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0]?.message || 'Data pendaftaran tidak valid.' },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone } = validated.data;
    const trimmedEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existing = await sql`
      SELECT id FROM public.profiles WHERE email = ${trimmedEmail} LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.' },
        { status: 400 }
      );
    }

    // Buat nomor anggota unik: LX-XXXX
    const countRes = await sql`SELECT COUNT(*)::int as count FROM public.profiles`;
    const nextNumber = ((countRes[0]?.count ?? 0) + 1).toString().padStart(4, '0');
    const memberNumber = `LX-${nextNumber}`;

    // Insert user baru dengan password_hash menggunakan pgcrypto crypt
    await sql`
      INSERT INTO public.profiles (
        full_name,
        role,
        member_number,
        phone,
        email,
        password_hash,
        status,
        no_show_count,
        created_at,
        updated_at
      ) VALUES (
        ${fullName.trim()},
        'member',
        ${memberNumber},
        ${phone?.trim() || null},
        ${trimmedEmail},
        crypt(${password}, gen_salt('bf')),
        'active',
        0,
        now(),
        now()
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Akun Anda telah aktif.',
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Terjadi kesalahan sistem saat mendaftar.' },
      { status: 500 }
    );
  }
}

