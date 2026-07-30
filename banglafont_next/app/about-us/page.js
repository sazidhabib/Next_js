import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">আমাদের সম্পর্কে</h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        বাঙালী হিসাবে নিজেদের ভাষালিপির অগ্রগতির জন্য আমাদের এই মহান উদ্যোগ, আমরা চাচ্ছি
        পৃথিবীর সকল ভাষার সাথে আমাদের প্রাণের বাংলা ভাষা তাল মিলিয়ে এগিয়ে যাবে সমান তালে।
      </p>
      <p className="text-gray-600 leading-relaxed mb-8">
        আমরা মূলত বাংলা বর্ণমালাকে কম্পিউটার বা ডিজিটাল মাধ্যমে ব্যবহার করার উপযোগী করে তুলি
        এবং আমাদের ওয়েবসাইটের মাধ্যমে সেটা সকলের কাছে পৌছে দিচ্ছি। যার সাথে থাকছে আমাদের
        গবেষণা, নতুন নতুন ফিচার যোগকরণ, মসৃণ যুক্তাক্ষর তৈরী, আধুনিক যুক্তাক্ষর নিয়ে গবেষণা
        এবং সর্বোপরি বর্ণকে সজ্জিতকরণের জন্য সকল ধরণের কার্যক্রম গ্রহণ।
      </p>
      <p className="text-gray-600 leading-relaxed mb-12">
        আমরা বাংলা ফন্ট তৈরী করে থাকি ইউনিকোড এবং আনন্দ কপিউটারের (বিজয়) কিবোর্ড লেআউট অনুসারে,
        আমাদের সকল ফন্ট স্মার্টফোন, কম্পিউটার, ট্যাব এবং টাইপ রিডিং করে এমন সকল সফটওয়্যারে
        ব্যবহার করতে পারবেন।
      </p>

      <div className="flex flex-wrap gap-4 mb-12">
        <Link href="/designer" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          আমাদের ডিজাইনারগণ &rarr;
        </Link>
        <Link href="/developer" className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
          আমাদের ডেভেলপারগণ &rarr;
        </Link>
      </div>

      <div className="border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">যোগাযোগ</h2>
        <p className="text-gray-600">ইমেইল: contact@fontbd.com</p>
      </div>
    </div>
  );
}
