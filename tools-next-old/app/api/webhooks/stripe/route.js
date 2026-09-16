import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { queryOne, update, insert } from '@/lib/db'

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const packageId = session.metadata?.packageId

        if (userId && packageId) {
          const pkg = await queryOne('SELECT credits FROM packages WHERE id = ?', [packageId])
          if (pkg) {
            await update('UPDATE users SET credits = credits + ? WHERE id = ?', [pkg.credits, userId])
            await insert(
              'INSERT INTO transactions (user_id, type, amount_cents, credits, stripe_payment_intent_id) VALUES (?, ?, ?, ?, ?)',
              [userId, 'package', session.amount_total || 0, pkg.credits, session.payment_intent]
            )
          }
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription
        const customerId = invoice.customer

        const user = await queryOne('SELECT id FROM users WHERE stripe_customer_id = ?', [customerId])
        if (user) {
          const sub = await queryOne(
            'SELECT package_id FROM subscriptions WHERE stripe_subscription_id = ?',
            [subscriptionId]
          )
          if (sub) {
            const pkg = await queryOne('SELECT credits FROM packages WHERE id = ?', [sub.package_id])
            if (pkg) {
              await update('UPDATE users SET credits = credits + ? WHERE id = ?', [pkg.credits, user.id])
              await insert(
                'INSERT INTO transactions (user_id, type, amount_cents, credits, stripe_invoice_id) VALUES (?, ?, ?, ?, ?)',
                [user.id, 'subscription', invoice.amount_paid || 0, pkg.credits, invoice.id]
              )
            }
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await update(
          'UPDATE subscriptions SET status = ? WHERE stripe_subscription_id = ?',
          ['canceled', sub.id]
        )
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
