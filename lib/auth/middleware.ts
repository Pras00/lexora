import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, parseSessionCookie, DEMO_ACCOUNTS } from '@/lib/auth';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const sessionPayload = parseSessionCookie(sessionCookie);

  let activeUser = null;
  let activeRole = 'member';

  if (sessionPayload) {
    const demoAccount = DEMO_ACCOUNTS[sessionPayload.email];
    activeUser = demoAccount?.user ?? {
      id: sessionPayload.id,
      email: sessionPayload.email,
      user_metadata: {
        full_name: sessionPayload.full_name,
        role: sessionPayload.role,
      },
    };
    activeRole = sessionPayload.role;
  }

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const fullDestination = `${pathname}${search}`;

  // 1. Rute autentikasi
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password');

  // 2. Rute Publik (/catalog SENGAJA TIDAK dimasukkan ke rute publik demi keamanan sistem)
  const isPublicRoute =
    pathname === '/' ||
    isAuthRoute ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/cron') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  // A. Jika belum login dan mencoba mengakses rute terproteksi
  if (!activeUser && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', fullDestination);
    return NextResponse.redirect(url);
  }

  // B. Jika sudah login dan mencoba mengakses login/register
  if (activeUser && isAuthRoute) {
    const redirectPath = activeRole === 'admin' ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // C. Proteksi Khusus Area Admin (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!activeUser) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', fullDestination);
      return NextResponse.redirect(url);
    }

    if (activeRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

