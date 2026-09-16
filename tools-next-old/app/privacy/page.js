import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description: 'FileConvert privacy policy. Learn how we handle your data.',
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p><em>Last updated: January 2024</em></p>

        <h2>1. Data We Collect</h2>
        <p>We collect information you provide directly: account information (name, email), file uploads, and payment information (processed by Stripe).</p>

        <h2>2. How We Use Your Data</h2>
        <p>We use your data to provide file conversion services, process payments, and communicate with you about your account.</p>

        <h2>3. File Processing</h2>
        <p>Files are uploaded temporarily for conversion purposes only. They are automatically deleted after processing. We do not access, read, or store your files beyond what is necessary for the conversion.</p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your data to third parties. We share data only with service providers necessary to operate our service (hosting, payment processing).</p>

        <h2>5. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We do not use tracking cookies without your consent.</p>

        <h2>6. Data Security</h2>
        <p>We implement industry-standard security measures including encryption in transit (TLS) and at rest (AES-256). See our <Link href="/security">security page</Link> for details.</p>

        <h2>7. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p>

        <h2>8. Contact</h2>
        <p>For privacy-related inquiries, please <Link href="/contact">contact us</Link>.</p>
      </div>
    </div>
  )
}
