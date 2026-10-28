import { neon, NeonQueryFunction } from '@neondatabase/serverless';

let cachedSql: NeonQueryFunction<false, false> | null = null;

/**
 * Mendapatkan instance koneksi NeonDB Serverless (HTTP Pooling)
 */
export function getDb(): NeonQueryFunction<false, false> {
  if (cachedSql) return cachedSql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }

  cachedSql = neon(url);
  return cachedSql;
}

/**
 * Tagged template helper untuk query SQL langsung ke NeonDB
 * Contoh: const books = await sql`SELECT * FROM books WHERE status = 'active'`;
 */
export const sql = (
  strings: TemplateStringsArray,
  ...values: (string | number | boolean | null | undefined | Date | object)[]
) => {
  const db = getDb();
  return db(strings, ...values);
};

