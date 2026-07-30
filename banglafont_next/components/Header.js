import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          ফন্টবিডি
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/free-fonts" className="hover:text-primary transition-colors">
            ফ্রি ফন্ট
          </Link>
          <Link href="/premium-font" className="hover:text-primary transition-colors">
            প্রিমিয়াম ফন্ট
          </Link>
          <Link href="/designer" className="hover:text-primary transition-colors">
            ডিজাইনার
          </Link>
          <Link href="/developer" className="hover:text-primary transition-colors">
            ডেভেলপার
          </Link>
          <Link href="/about-us" className="hover:text-primary transition-colors">
            আমাদের সম্পর্কে
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/unicode-to-ansi-converter"
            className="hidden sm:inline-flex text-sm text-primary hover:underline"
          >
            কনভার্টার
          </Link>
          <Link
            href="/admin"
            className="text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            অ্যাডমিন
          </Link>
        </div>
      </div>
    </header>
  );
}
