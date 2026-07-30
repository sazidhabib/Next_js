"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold text-gray-200 mb-4">ERROR</h1>
      <p className="text-gray-600 mb-6">কিছু একটা ভুল হয়েছে</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
