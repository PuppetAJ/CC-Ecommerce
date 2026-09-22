import type { Role } from './options.ts'

// Public on purpose: the login page prints them so a reviewer can get in without registering.
export const demoAccounts = {
  customer: { name: 'Demo Shopper', email: 'shopper@wicken.store', password: 'demo-password' },
  admin: { name: 'Demo Admin', email: 'admin@wicken.store', password: 'demo-password' },
} satisfies Record<Role, { name: string; email: string; password: string }>
