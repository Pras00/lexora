import { Profile, UserRole, User } from '@/types';
import { cookies } from 'next/headers';
import { sql } from '@/lib/db/neon';

export const SESSION_COOKIE_NAME = 'lexora_session';

export interface DemoAccount {
  user: User;
  profile: Profile;
  passwords: string[];
}

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  'admin@lexora.id': {
    user: {
      id: '11111111-1111-1111-1111-111111111111',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { full_name: 'Pustakawan Utama', role: 'admin' },
      aud: 'authenticated',
      confirmation_sent_at: '',
      recovery_sent_at: '',
      email_change_sent_at: '',
      new_email: '',
      invited_at: '',
      action_link: '',
      email: 'admin@lexora.id',
      phone: '',
      created_at: '2026-01-01T00:00:00.000Z',
      confirmed_at: '2026-01-01T00:00:00.000Z',
      email_confirmed_at: '2026-01-01T00:00:00.000Z',
      phone_confirmed_at: '',
      last_sign_in_at: '2026-01-01T00:00:00.000Z',
      role: 'authenticated',
      updated_at: '2026-01-01T00:00:00.000Z',
      identities: [],
      is_anonymous: false,
      factors: [],
    },
    profile: {
      id: '11111111-1111-1111-1111-111111111111',
      full_name: 'Pustakawan Utama',
      role: 'admin',
      member_number: 'LX-0001',
      phone: '081234567890',
      status: 'active',
      no_show_count: 0,
      suspended_until: null,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    passwords: ['admin12345', 'password123'],
  },
  'member@lexora.id': {
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { full_name: 'Pras Santoso', role: 'member' },
      aud: 'authenticated',
      confirmation_sent_at: '',
      recovery_sent_at: '',
      email_change_sent_at: '',
      new_email: '',
      invited_at: '',
      action_link: '',
      email: 'member@lexora.id',
      phone: '',
      created_at: '2026-01-01T00:00:00.000Z',
      confirmed_at: '2026-01-01T00:00:00.000Z',
      email_confirmed_at: '2026-01-01T00:00:00.000Z',
      phone_confirmed_at: '',
      last_sign_in_at: '2026-01-01T00:00:00.000Z',
      role: 'authenticated',
      updated_at: '2026-01-01T00:00:00.000Z',
      identities: [],
      is_anonymous: false,
      factors: [],
    },
    profile: {
      id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Pras Santoso',
      role: 'member',
      member_number: 'LX-0002',
      phone: '081298765432',
      status: 'active',
      no_show_count: 0,
      suspended_until: null,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    passwords: ['member12345', 'password123'],
  },
  'user@lexora.id': {
    user: {
      id: '22222222-2222-2222-2222-222222222222',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { full_name: 'Pras Santoso', role: 'member' },
      aud: 'authenticated',
      confirmation_sent_at: '',
      recovery_sent_at: '',
      email_change_sent_at: '',
      new_email: '',
      invited_at: '',
      action_link: '',
      email: 'user@lexora.id',
      phone: '',
      created_at: '2026-01-01T00:00:00.000Z',
      confirmed_at: '2026-01-01T00:00:00.000Z',
      email_confirmed_at: '2026-01-01T00:00:00.000Z',
      phone_confirmed_at: '',
      last_sign_in_at: '2026-01-01T00:00:00.000Z',
      role: 'authenticated',
      updated_at: '2026-01-01T00:00:00.000Z',
      identities: [],
      is_anonymous: false,
      factors: [],
    },
    profile: {
      id: '22222222-2222-2222-2222-222222222222',
      full_name: 'Pras Santoso',
      role: 'member',
      member_number: 'LX-0002',
      phone: '081298765432',
      status: 'active',
      no_show_count: 0,
      suspended_until: null,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    },
    passwords: ['password123', 'member12345'],
  },
};

export interface SessionPayload {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  member_number: string;
}

export function parseSessionCookie(cookieValue?: string | null): SessionPayload | null {
  if (!cookieValue) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue));
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.email && parsed.role) {
      return parsed as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Mendapatkan user dan profile yang sedang login dari cookie sesi (Server Side)
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  profile: Profile | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const payload = parseSessionCookie(sessionCookie);

    if (!payload) {
      return { user: null, profile: null };
    }

    const demo = DEMO_ACCOUNTS[payload.email];
    const user = demo?.user ?? ({
      id: payload.id,
      email: payload.email,
      user_metadata: {
        full_name: payload.full_name,
        role: payload.role,
      },
    } as unknown as User);

    let profile: Profile | null = demo?.profile ?? null;

    if (!profile && process.env.DATABASE_URL) {
      try {
        const rows = await sql`SELECT * FROM profiles WHERE id = ${payload.id} LIMIT 1`;
        if (rows && rows.length > 0) {
          profile = rows[0] as unknown as Profile;
        }
      } catch {
        // Abaikan jika query gagal
      }
    }

    if (!profile) {
      profile = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        full_name: payload.full_name,
        member_number: payload.member_number,
        phone: null,
        status: 'active',
        no_show_count: 0,
        suspended_until: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as Profile;
    }

    return { user, profile };
  } catch {
    return { user: null, profile: null };
  }
}
