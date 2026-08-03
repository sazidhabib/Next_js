import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0c10] border-t border-white/10 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00e599] to-emerald-400 flex items-center justify-center text-gray-950 font-black text-xs">
                অ
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Bangla<span className="text-[#00e599]">Type</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              বাংলাদেশের সর্ববৃহৎ বাংলা ফন্ট প্ল্যাটফর্ম। ডিজাইন ও টাইপোগ্রাফির বিশ্বস্ত সমাধান।
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              ফন্টস & রিসোর্স
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/free-fonts" className="hover:text-[#00e599] transition-colors">ফ্রি ফন্টস</Link></li>
              <li><Link href="/premium-font" className="hover:text-[#00e599] transition-colors">প্রিমিয়াম ফন্টস</Link></li>
              <li><Link href="/designer" className="hover:text-[#00e599] transition-colors">ডিজাইনার তালিকা</Link></li>
              <li><Link href="/developer" className="hover:text-[#00e599] transition-colors">ডেভেলপার তালিকা</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              তথ্য ও সহায়তা
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about-us" className="hover:text-[#00e599] transition-colors">আমাদের সম্পর্কে</Link></li>
              <li><Link href="/eula" className="hover:text-[#00e599] transition-colors">লাইসেন্স ও শর্তাবলী</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3">
              যোগাযোগ
            </h4>
            <p className="text-xs text-gray-400">support@banglatype.com</p>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-xs text-center text-gray-500">
          © {new Date().getFullYear()} BanglaType. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
