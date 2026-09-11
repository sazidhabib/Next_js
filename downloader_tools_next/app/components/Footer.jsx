import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-sm shadow-indigo-500/20">
              <svg className="h-4 w-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="text-base font-extrabold text-slate-900">
              Media<span className="text-indigo-600">Drop</span>
            </span>
          </Link>
          <p className="text-center text-xs text-slate-500 sm:text-left">
            &copy; {new Date().getFullYear()} MediaDrop. All rights reserved. For personal and fair use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
