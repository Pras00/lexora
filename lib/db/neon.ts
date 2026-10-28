import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let cachedSql: NeonQueryFunction<false, false> | null = null;
let cachedUrl: string | null = null;

/**
 * Mendapatkan instance koneksi NeonDB Serverless (HTTP Pooling)
 */
export function getDb(): NeonQueryFunction<false, false> {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }

  // Sanitasi URL: bersihkan parameter channel_binding yang tidak kompatibel dengan HTTP fetch driver
  const sanitizedUrl = rawUrl.replace(/[?&]channel_binding=[^&]+/g, '');

  if (cachedSql && cachedUrl === sanitizedUrl) {
    return cachedSql;
  }

  cachedUrl = sanitizedUrl;
  cachedSql = neon(sanitizedUrl);
  return cachedSql;
}

/**
 * Tagged template helper untuk query SQL langsung ke NeonDB dengan ketahanan otomatis (auto-retry).
 * Secara cerdas memulihkan koneksi saat instance NeonDB sedang cold-start (bangun dari suspensi 5 menit).
 *
 * Contoh: const books = await sql`SELECT * FROM books WHERE status = 'active'`;
 */
export const sql = async (
  strings: TemplateStringsArray,
  ...values: (string | number | boolean | null | undefined | Date | object)[]
) => {
  const db = getDb();

  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts) {
    try {
      return await db(strings, ...values);
    } catch (err: unknown) {
      attempts++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      const isTransientError =
        errorMessage.includes('fetch failed') ||
        errorMessage.includes('ConnectTimeoutError') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('ECONNRESET');

      if (isTransientError && attempts < maxAttempts) {
        // Berikan jeda 800ms agar compute endpoint Neon selesai bangun
        await new Promise((resolve) => setTimeout(resolve, 800));
        continue;
      }
      throw err;
    }
  }

  return db(strings, ...values);
};
