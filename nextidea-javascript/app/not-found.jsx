import Link from "next/link";
import { ArrowLeft, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-[180px] md:text-[240px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-zinc-800 to-zinc-900 select-none">
            404
          </h1>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-60px]">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/20 blur-[60px] md:blur-[80px] animate-pulse" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
          Page Not Found
        </h2>
        
        <p className="text-lg text-zinc-400 mb-10 relative z-10">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-zinc-700 hover:border-primary text-white font-semibold rounded-full transition-all duration-300"
          >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-zinc-500">
          <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <span className="w-1 h-1 rounded-full bg-zinc-600" />
          <Link href="/protfolio" className="hover:text-primary transition-colors">Portfolio</Link>
        </div>
      </div>
    </div>
  );
}
