import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service',
  description: 'FileConvert terms of service. Read our usage terms and conditions.',
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="prose">
        <h1>Terms of Service</h1>
        <p><em>Last updated: January 2024</em></p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using FileConvert, you agree to these Terms of Service. If you do not agree, do not use our service.</p>

        <h2>2. Service Description</h2>
        <p>FileConvert provides online file conversion services. We support various file formats and conversion types.</p>

        <h2>3. Account Registration</h2>
        <p>You may create an account to access additional features. You are responsible for maintaining the confidentiality of your account credentials.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to: upload malicious files, attempt to circumvent service limits, resell the service without authorization, or use the service for illegal purposes.</p>

        <h2>5. Credits and Payments</h2>
        <p>Credits are consumed per conversion. Packages are one-time purchases; subscriptions renew monthly. Unused subscription credits do not roll over.</p>

        <h2>6. Intellectual Property</h2>
        <p>You retain ownership of your files. We claim no rights over your uploaded or converted content.</p>

        <h2>7. Limitation of Liability</h2>
        <p>FileConvert is provided &quot;as is&quot; without warranties. We are not liable for any damages arising from the use of our service.</p>

        <h2>8. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of the service constitutes acceptance of updated terms.</p>

        <h2>9. Contact</h2>
        <p>For questions about these terms, <Link href="/contact">contact us</Link>.</p>
      </div>
    </div>
  )
}
