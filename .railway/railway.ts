import { defineRailway, github, postgres, project, service } from 'railway/iac'

/**
 * The Railway project. `railway config apply` shows its plan and asks first.
 * Service names must match the dashboard, and everything the project holds must
 * be listed: an omission reads as a deletion.
 */
export default defineRailway(() => {
  // Deploy only once GitHub's checks have passed.
  const repository = github('PuppetAJ/CC-Ecommerce', { checkSuites: true })

  const database = postgres('Postgres')

  const app = service('Wicken', {
    source: repository,
    build: 'pnpm build',
    start: 'pnpm start',
    deploy: {
      healthcheckPath: '/api/health',
      healthcheckTimeout: 100,
      // Stops when idle and wakes on the next request; idle time is billed.
      sleepApplication: true,
      numReplicas: 1,
    },
    env: {
      NODE_ENV: 'production',
      PORT: '8080',
      NEXT_PUBLIC_APP_URL: 'https://wicken-production.up.railway.app',
      // Railway resolves this reference to the database's own connection string.
      DATABASE_URL: '${{Postgres.DATABASE_URL}}',
    },
  })

  // The demo admin writes for real, so something has to put the shop back. Runs nightly at
  // 04:00 UTC, which is the quietest hour for a portfolio nobody is reading at 4am.
  const reset = service('Reset', {
    source: repository,
    build: 'pnpm install --frozen-lockfile',
    start: 'pnpm db:migrate && pnpm db:seed',
    deploy: {
      cronSchedule: '0 4 * * *',
      // A failed run waits for the next schedule rather than looping.
      restartPolicyType: 'NEVER',
    },
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: '${{Postgres.DATABASE_URL}}',
    },
  })

  return project('wicken', { resources: [database, app, reset] })
})
