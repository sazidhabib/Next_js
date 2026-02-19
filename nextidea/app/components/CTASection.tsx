import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-24 bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your
          <span className="text-primary"> Digital Presence?</span>
        </h2>

        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Let&apos;s discuss how we can help you achieve your business goals
          with strategic creative solutions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#portfolio"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-700 text-white font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-300"
          >
            View Our Work
          </Link>
        </div>
      </div>
    </section>
  );
}
