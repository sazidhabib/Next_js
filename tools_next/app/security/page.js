export const metadata = {
  title: 'Security & Compliance',
  description: 'FileConvert is committed to maintaining an extensive security program. Learn about our security measures and compliance.',
}

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-4">Security & Compliance</h1>
      <p className="text-muted leading-relaxed mb-8">
        FileConvert is committed to maintaining an extensive security program that includes both technical and organizational security measures.
      </p>

      <div className="space-y-6">
        <SecurityItem
          title="Data Processing"
          desc="Files are processed for the conversion job you request, then removed after processing. We never access, sell, or mine your file data."
        />
        <SecurityItem
          title="Encryption"
          desc="All file transfers are encrypted with TLS 1.2+. Files are encrypted at rest using AES-256 encryption."
        />
        <SecurityItem
          title="Data Isolation"
          desc="Each conversion runs in an isolated environment. File data is never shared between different conversion jobs."
        />
        <SecurityItem
          title="Automatic Deletion"
          desc="Files are automatically deleted after processing according to our retention policy. We do not provide permanent file storage."
        />
        <SecurityItem
          title="Infrastructure Security"
          desc="Our infrastructure is hosted on enterprise-grade cloud providers with SOC 2 Type II compliance. We use firewalls, intrusion detection, and regular security audits."
        />
        <SecurityItem
          title="Access Control"
          desc="Access to our systems is governed by strict access controls. API authentication uses API keys with fine-grained scopes."
        />
        <SecurityItem
          title="GDPR Compliance"
          desc="As a service committed to user privacy, we comply with the General Data Protection Regulation (GDPR). Contact us for a Data Processing Agreement."
        />
        <SecurityItem
          title="Regular Audits"
          desc="We conduct regular security assessments, penetration testing, and code reviews to identify and address potential vulnerabilities."
        />
      </div>
    </div>
  )
}

function SecurityItem({ title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </div>
  )
}
