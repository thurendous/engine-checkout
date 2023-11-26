import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const { NEXT_PUBLIC_STRIPE_SECRET_KEY } = process.env

export async function POST(req: Request) {
  if (!NEXT_PUBLIC_STRIPE_SECRET_KEY) {
    throw 'Server misconfigured. Did you forget to add a ".env.local" file?'
  }

  const { address: buyerWalletAddress } = await req.json()
  if (!buyerWalletAddress) {
    throw 'Request is missing "buyerWalletAddress".'
  }

  // Create a Stripe payment intent for $100 USD.
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
  })
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100_00,
    currency: 'usd',
    description: 'Example NFT delivered by thirdweb Engine',
    payment_method_types: ['card'],
    metadata: { buyerWalletAddress },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
  })
}
