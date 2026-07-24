import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-12-18.acacia',
})

export async function createCheckoutSession(userId, packageId, type = 'package') {
  const user = await import('./db').then((m) =>
    m.queryOne('SELECT email, stripe_customer_id FROM users WHERE id = ?', [userId])
  )

  let customerId = user?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user?.email,
      metadata: { userId: String(userId) },
    })
    customerId = customer.id

    await import('./db').then((m) =>
      m.update('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [customerId, userId])
    )
  }

  if (type === 'subscription') {
    const pkg = await import('./db').then((m) =>
      m.queryOne('SELECT * FROM packages WHERE id = ?', [packageId])
    )

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: pkg.stripe_price_id, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: { userId: String(userId), packageId: String(packageId) },
    })

    return session.url
  }

  const pkg = await import('./db').then((m) =>
    m.queryOne('SELECT * FROM packages WHERE id = ?', [packageId])
  )

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [{ price: pkg.stripe_price_id, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: String(userId), packageId: String(packageId), type: 'package' },
  })

  return session.url
}
