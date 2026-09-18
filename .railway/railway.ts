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

  return project('wicken', { resources: [database, app] })
})
