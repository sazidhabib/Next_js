import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ফন্টবিডি</h3>
            <p className="text-sm leading-relaxed">
              বাংলাদেশের সর্ববৃহৎ বাংলা ফন্ট ফাউন্ড্রি। বিনামূল্যে ডাউনলোড করুন
              সুন্দর বাংলা ফন্ট।
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">পেজ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/free-fonts" className="hover:text-white transition-colors">ফ্রি ফন্ট</Link></li>
              <li><Link href="/premium-font" className="hover:text-white transition-colors">প্রিমিয়াম ফন্ট</Link></li>
              <li><Link href="/designer" className="hover:text-white transition-colors">ডিজাইনার</Link></li>
              <li><Link href="/developer" className="hover:text-white transition-colors">ডেভেলপার</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">গুরুত্বপূর্ণ লিংক</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="hover:text-white transition-colors">যোগাযোগ</Link></li>
              <li><Link href="/eula" className="hover:text-white transition-colors">শর্তাবলী</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">যোগাযোগ</h4>
            <ul className="space-y-2 text-sm">
              <li>ইমেইল: contact@fontbd.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} All rights reserved. Developed by Codepotro
        </div>
      </div>
    </footer>
  );
}
