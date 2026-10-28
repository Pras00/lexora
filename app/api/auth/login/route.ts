import { NextResponse, type NextRequest } from 'next/server';
import { DEMO_ACCOUNTS, SESSION_COOKIE_NAME, SessionPayload } from '@/lib/auth';
import { sql } from '@/lib/db/neon';
import { UserRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan kata sandi wajib diisi.' },
        { status: 400 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // 1. Autentikasi via NeonDB (PostgreSQL)
    if (process.env.DATABASE_URL) {
      try {
        const rows = await sql`
          SELECT id, email, role, full_name, member_number
          FROM public.profiles
          WHERE email = ${trimmedEmail}
            AND (
              password_hash = crypt(${password}, password_hash)
              OR password_hash = ${password}
            )
          LIMIT 1
        `;

        if (rows && rows.length > 0) {
          const user = rows[0] as unknown as {
            id: string;
            email: string;
            role: UserRole;
            full_name: string;
            member_number: string;
          };

          const payload: SessionPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            full_name: user.full_name,
            member_number: user.member_number,
          };

          const redirectPath =
            payload.role === 'admin' ? '/admin/dashboard' : '/dashboard';

          const res = NextResponse.json({
            success: true,
            redirectPath,
          });

          res.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(payload), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 hari
          });

          return res;
        }
      } catch (err) {
        console.warn('NeonDB auth query error, mengevaluasi fallback demo:', err);
      }
    }

    // 2. Fallback untuk Akun Demo (In-Memory)
    const demoAccount = DEMO_ACCOUNTS[trimmedEmail];
    if (demoAccount && demoAccount.passwords.includes(password)) {
      const payload: SessionPayload = {
        id: demoAccount.user.id,
        email: demoAccount.user.email ?? trimmedEmail,
        role: demoAccount.profile.role,
        full_name: demoAccount.profile.full_name,
        member_number: demoAccount.profile.member_number,
      };

      const redirectPath =
        payload.role === 'admin' ? '/admin/dashboard' : '/dashboard';

      const res = NextResponse.json({
        success: true,
        redirectPath,
      });

      res.cookies.set(SESSION_COOKIE_NAME, JSON.stringify(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 hari
      });

      return res;
    }

    // 3. Kredensial tidak cocok
    return NextResponse.json(
      {
        success: false,
        error: 'Email atau kata sandi yang Anda masukkan salah.',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Unhandled login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan sistem saat memproses login.',
      },
      { status: 500 }
    );
  }
}
