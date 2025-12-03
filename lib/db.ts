import { sql } from '@vercel/postgres'

export type DBAd = {
  id: string
  title: string
  description: string
  media_type: 'image' | 'video'
  media_url: string
  target_link: string
  button_text: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function initAdsTable() {
  await sql`CREATE TABLE IF NOT EXISTS advertisements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_type TEXT NOT NULL,
    media_url TEXT NOT NULL,
    target_link TEXT NOT NULL,
    button_text TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );`
}

export async function listActiveAds(): Promise<DBAd[]> {
  const { rows } = await sql<DBAd>`SELECT * FROM advertisements WHERE is_active = true ORDER BY updated_at DESC`;
  return rows
}

export async function listAllAds(): Promise<DBAd[]> {
  const { rows } = await sql<DBAd>`SELECT * FROM advertisements ORDER BY updated_at DESC`;
  return rows
}

export async function createAd(input: Omit<DBAd, 'id'|'created_at'|'updated_at'>): Promise<DBAd> {
  const id = (globalThis.crypto ?? (await import('crypto')).webcrypto).randomUUID();
  const { rows } = await sql<DBAd>`
    INSERT INTO advertisements (id, title, description, media_type, media_url, target_link, button_text, is_active)
    VALUES (${id}, ${input.title}, ${input.description}, ${input.media_type}, ${input.media_url}, ${input.target_link}, ${input.button_text}, ${input.is_active})
    RETURNING *`;
  return rows[0]
}

export async function updateAd(id: string, updates: Partial<Omit<DBAd, 'id'|'created_at'|'updated_at'>>): Promise<DBAd | null> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1
  for (const [k, v] of Object.entries(updates)) {
    fields.push(`${k} = $${idx++}`)
    values.push(v)
  }
  if (fields.length === 0) return null
  const query = `UPDATE advertisements SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $$${idx} RETURNING *` as any
  const { rows } = await sql.query(query, [...values, id]) as any
  return rows[0] ?? null
}

export async function deleteAd(id: string): Promise<void> {
  await sql`DELETE FROM advertisements WHERE id = ${id}`
}
