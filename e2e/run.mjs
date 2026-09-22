// Runs the browser suites one after another. They share a database, so never in parallel.
import { spawn } from 'node:child_process'
import { Client } from 'pg'

const suites = ['storefront', 'layout', 'account', 'admin', 'cart']
const wanted = process.argv.slice(2)
const unknown = wanted.filter((name) => !suites.includes(name))
if (unknown.length) {
  console.error(`No such suite: ${unknown.join(', ')}. Try one of ${suites.join(', ')}.`)
  process.exit(2)
}

// The throttling checks spend the sign-in budget, so a rerun within the minute fails for that reason alone.
if (process.env.DATABASE_URL) {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  await client.query('DELETE FROM rate_limits')
  await client.end()
}

let failed = 0
for (const suite of wanted.length ? wanted : suites) {
  console.log(`\n${'='.repeat(60)}\n${suite}\n${'='.repeat(60)}`)
  const code = await new Promise((resolve) => {
    spawn(process.execPath, [`e2e/${suite}.mjs`], { stdio: 'inherit' }).on('close', resolve)
  })
  if (code !== 0) failed++
}

console.log(failed ? `\n${failed} suite${failed === 1 ? '' : 's'} failed` : '\nEvery suite passed')
process.exit(failed ? 1 : 0)
