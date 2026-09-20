import 'server-only'
import { pool } from '../pool.ts'

export async function renameUser(userId: string, name: string): Promise<void> {
  await pool.query('UPDATE users SET name = $1, updated_at = now() WHERE id = $2', [name, userId])
}

/**
 * Every table that references a user cascades, so this removes the account, its sessions,
 * its cart, its favorites, its reviews and its orders. A real shop would keep the orders
 * and anonymise them; see docs/SECURITY.md.
 */
export async function deleteUser(userId: string): Promise<void> {
  await pool.query('DELETE FROM users WHERE id = $1', [userId])
}
