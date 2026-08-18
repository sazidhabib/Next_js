import Link from "next/link";

export const metadata = {
  title: "আমাদের সম্পর্কে — NextType",
  description: "NextType-এর লক্ষ্য এবং বাংলা টাইপোগ্রাফির অগ্রগতি নিয়ে আমাদের কার্যক্রম সম্পর্কে জানুন।",
  alternates: {
    canonical: "/about-us",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">আমাদের সম্পর্কে</h1>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 sm:mb-8">
        বাঙালী হিসাবে নিজেদের ভাষালিপির অগ্রগতির জন্য আমাদের এই মহান উদ্যোগ, আমরা চাচ্ছি
        পৃথিবীর সকল ভাষার সাথে আমাদের প্রাণের বাংলা ভাষা তাল মিলিয়ে এগিয়ে যাবে সমান তালে।
      </p>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-6 sm:mb-8">
        আমরা মূলত বাংলা বর্ণমালাকে কম্পিউটার বা ডিজিটাল মাধ্যমে ব্যবহার করার উপযোগী করে তুলি
        এবং আমাদের ওয়েবসাইটের মাধ্যমে সেটা সকলের কাছে পৌছে দিচ্ছি। যার সাথে থাকছে আমাদের
        গবেষণা, নতুন নতুন ফিচার যোগকরণ, মসৃণ যুক্তাক্ষর তৈরী, আধুনিক যুক্তাক্ষর নিয়ে গবেষণা
        এবং সর্বোপরি বর্ণকে সজ্জিতকরণের জন্য সকল ধরণের কার্যক্রম গ্রহণ।
      </p>
      <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-8 sm:mb-12">
        আমরা বাংলা ফন্ট তৈরী করে থাকি ইউনিকোড এবং আনন্দ কপিউটারের (বিজয়) কিবোর্ড লেআউট অনুসারে,
        আমাদের সকল ফন্ট স্মার্টফোন, কম্পিউটার, ট্যাব এবং টাইপ রিডিং করে এমন সকল সফটওয়্যারে
        ব্যবহার করতে পারবেন।
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
        <Link href="/designer" className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#00e599] text-gray-950 rounded-xl font-semibold hover:bg-[#00c784] transition-colors text-sm text-center">
          আমাদের ডিজাইনারগণ &rarr;
        </Link>
        <Link href="/developer" className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-[#00e599] text-[#00e599] rounded-xl font-semibold hover:bg-[#00e599] hover:text-gray-950 transition-colors text-sm text-center">
          আমাদের ডেভেলপারগণ &rarr;
        </Link>
      </div>

      <div className="border-t border-white/10 pt-6 sm:pt-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">যোগাযোগ</h2>
        <p className="text-sm text-gray-400">ইমেইল: contact@fontbd.com</p>
      </div>
    </div>
  );
}
