import { execFileSync } from 'node:child_process'
import { Client } from 'pg'

// A fresh environment has tables but no catalog until the nightly reset first fires, which can be
// most of a day away. This fills it on the first boot and does nothing on every boot after.
const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is not set')

const client = new Client({ connectionString: url })
await client.connect()
const { rows } = await client.query<{ count: string }>('SELECT count(*) AS count FROM products')
await client.end()

if (Number(rows[0].count) > 0) {
  console.log(`${rows[0].count} products already; leaving the catalog alone`)
} else {
  console.log('No products yet, seeding')
  execFileSync('pnpm', ['db:seed'], { stdio: 'inherit' })
}
