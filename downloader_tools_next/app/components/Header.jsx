import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">SaveSocial<span className="text-blue-600">Videos</span></span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How to Use</a>
          <a href="#platforms" className="hover:text-blue-600 transition-colors">Platforms</a>
        </nav>
      </div>
    </header>
  );
}
