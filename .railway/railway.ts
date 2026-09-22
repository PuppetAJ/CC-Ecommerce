import { defineRailway, github, postgres, preserve, project, service } from 'railway/iac'

/** Every service must be listed and named as the dashboard names it: an omission reads as a deletion. */
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
      // Set in the dashboard and never in this file; listed so applying does not delete them.
      BETTER_AUTH_SECRET: preserve(),
      STRIPE_SECRET_KEY: preserve(),
      STRIPE_WEBHOOK_SECRET: preserve(),
      GOOGLE_CLIENT_ID: preserve(),
      GOOGLE_CLIENT_SECRET: preserve(),
    },
  })

  // The demo admin writes for real, so a nightly 04:00 UTC run puts the shop back.
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
      // The seed loads the app's environment module, which refuses to start without this.
      BETTER_AUTH_SECRET: '${{Wicken.BETTER_AUTH_SECRET}}',
    },
  })

  return project('wicken', { resources: [database, app, reset] })
})
