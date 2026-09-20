import 'server-only'
import Stripe from 'stripe'
import { env } from './env.ts'

// Pinned rather than floating: an account's default version can change under us, and a
// checkout session's shape is something the webhook has to agree about.
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-08-26.dahlia' })
  : null
