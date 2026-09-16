'use client'

import { useState } from 'react'
import Link from 'next/link'
import CreditSlider from '@/components/pricing/CreditSlider'
import PricingCard from '@/components/pricing/PricingCard'

const PRICING_PLANS = {
  free: {
    name: 'Free',
    description: 'For personal use, testing and hobby projects.',
    basePrice: 0,
    features: [
      { text: '10 conversions per day', included: true },
      { text: 'All file formats', included: true },
      { text: 'Max file size: 1 GB', included: true },
      { text: 'All API features', included: true },
      { text: 'Processing priority: Standard', included: true },
      { text: 'No credit card required', included: true },
    ],
    cta: 'Get Started Free',
    href: '/register',
  },
  package: {
    name: 'Package',
    description: 'One-time payment. Credits never expire.',
    features: [
      { text: 'All file formats', included: true },
      { text: 'Unlimited file size', included: true },
      { text: 'All API features', included: true },
      { text: 'High processing priority', included: true },
      { text: 'Credits never expire', included: true },
      { text: 'Pay as you go', included: true },
    ],
    cta: 'Buy Package',
    href: '/register',
  },
  subscription: {
    name: 'Subscription',
    description: 'Monthly credits at our best rates.',
    features: [
      { text: 'All file formats', included: true },
      { text: 'Unlimited file size', included: true },
      { text: 'All API features', included: true },
      { text: 'High processing priority', included: true },
      { text: 'Up to 50% cheaper per credit', included: true },
      { text: 'Cancel anytime', included: true },
    ],
    cta: 'Subscribe',
    highlighted: true,
    href: '/register',
  },
  enterprise: {
    name: 'Enterprise',
    description: 'Custom plans for large-scale workloads.',
    price: 'Custom',
    features: [
      { text: 'Everything in Subscription', included: true },
      { text: 'Custom credit amounts', included: true },
      { text: 'Dedicated processing capacity', included: true },
      { text: '99.9% SLA', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom contracts & NDAs', included: true },
    ],
    cta: 'Contact Sales',
    href: '/contact',
  },
}

export default function PricingPage() {
  const [credits, setCredits] = useState(1000)

  const packagePrice = (credits * 0.007).toFixed(2)
  const subPrice = (credits * 0.0035).toFixed(2)

  return (
    <div className="flex flex-col">
      <section className="py-16 sm:py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Pricing
          </h1>
          <p className="mt-4 text-lg text-muted max-w-xl mx-auto">
            Pay only for what you need. Use the slider to choose the number of conversion
            credits you want, and see prices update instantly.
          </p>
          <div className="mt-10 max-w-lg mx-auto">
            <CreditSlider onChange={setCredits} />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PricingCard
            {...PRICING_PLANS.free}
          />
          <PricingCard
            {...PRICING_PLANS.package}
            price={`$${packagePrice}`}
            credits={credits.toLocaleString()}
          />
          <PricingCard
            {...PRICING_PLANS.subscription}
            price={`$${subPrice}`}
            period="/month"
            credits={`${credits.toLocaleString()}/mo`}
          />
          <PricingCard
            {...PRICING_PLANS.enterprise}
          />
        </div>
      </section>

      <section className="py-16 px-4 bg-surface border-t border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="What are conversion credits?"
              answer="Credits are the currency for file conversions on FileConvert. The longer a conversion takes, the more credits it consumes. Most conversions consume 1 credit, while complex conversions (like PDF to Office) may consume 2-4 credits. Only successful conversions are charged."
            />
            <FaqItem
              question="What is the difference between a package and a subscription?"
              answer="Packages are one-time purchases — your credits never expire and you can use them whenever you like. Subscriptions charge a monthly fee for a fixed amount of credits at a lower per-credit price, but unused credits do not roll over. Subscriptions can be up to 50% cheaper than packages."
            />
            <FaqItem
              question="Can I combine packages and subscriptions?"
              answer="Yes! Your credits from your monthly subscription will be consumed first, and then your package credits will be consumed."
            />
            <FaqItem
              question="Which payment methods are available?"
              answer="We accept all major credit cards including Visa, MasterCard, and American Express."
            />
            <FaqItem
              question="When can I cancel my subscription?"
              answer="You can cancel your subscription at any time. There is no minimum term. You can also switch to a different subscription at any time, but any remaining conversion credits will expire."
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ready to get started?
          </h2>
          <p className="text-muted mb-6">
            Start free with 10 conversions per day. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FaqItem({ question, answer }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-semibold text-foreground mb-2">{question}</h3>
      <p className="text-sm text-muted leading-relaxed">{answer}</p>
    </div>
  )
}
