import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { packageId, type } = await request.json()

  if (!packageId) {
    return NextResponse.json({ error: 'Package ID required' }, { status: 400 })
  }

  try {
    const url = await createCheckoutSession(session.user.id, packageId, type || 'package')
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
