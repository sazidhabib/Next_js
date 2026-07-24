import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the FileConvert team. We are here to help.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
      <p className="text-muted mb-8">
        Have a question or need help? Fill out the form below and we will get back to you.
      </p>
      <ContactForm />
    </div>
  )
}
