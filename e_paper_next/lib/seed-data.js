export const initialSeedData = {
  edition: {
    id: 1,
    title: "আজকের পত্রিকা - ঢাকা সিটি",
    publishDate: "২০২৪-০৮-০৬",
    editionType: "ঢাকা সিটি",
    language: "bn",
    status: "published",
  },
  pages: [
    {
      id: 1,
      editionId: 1,
      pageNumber: 1,
      pageTitle: "প্রথম পাতা (ঢাকা সিটি)",
      imageUrl: "/sample-epaper/page_1.svg",
      thumbUrl: "/sample-epaper/page_1.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 2,
      editionId: 1,
      pageNumber: 2,
      pageTitle: "জাতীয় ও নগর",
      imageUrl: "/sample-epaper/page_2.svg",
      thumbUrl: "/sample-epaper/page_2.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 3,
      editionId: 1,
      pageNumber: 3,
      pageTitle: "বাণিজ্য ও অর্থনীতি",
      imageUrl: "/sample-epaper/page_2.svg",
      thumbUrl: "/sample-epaper/page_2.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 4,
      editionId: 1,
      pageNumber: 4,
      pageTitle: "খেলাধুলা",
      imageUrl: "/sample-epaper/page_1.svg",
      thumbUrl: "/sample-epaper/page_1.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 5,
      editionId: 1,
      pageNumber: 5,
      pageTitle: "আন্তর্জাতিক",
      imageUrl: "/sample-epaper/page_2.svg",
      thumbUrl: "/sample-epaper/page_2.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 6,
      editionId: 1,
      pageNumber: 6,
      pageTitle: "সম্পাদকীয় ও মতামত",
      imageUrl: "/sample-epaper/page_1.svg",
      thumbUrl: "/sample-epaper/page_1.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 7,
      editionId: 1,
      pageNumber: 7,
      pageTitle: "সাহিত্য ও সংস্কৃতি",
      imageUrl: "/sample-epaper/page_2.svg",
      thumbUrl: "/sample-epaper/page_2.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 8,
      editionId: 1,
      pageNumber: 8,
      pageTitle: "বিনোদন",
      imageUrl: "/sample-epaper/page_1.svg",
      thumbUrl: "/sample-epaper/page_1.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 9,
      editionId: 1,
      pageNumber: 9,
      pageTitle: "তথ্যপ্রযুক্তি",
      imageUrl: "/sample-epaper/page_2.svg",
      thumbUrl: "/sample-epaper/page_2.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 10,
      editionId: 1,
      pageNumber: 10,
      pageTitle: "লাইফস্টাইল",
      imageUrl: "/sample-epaper/page_1.svg",
      thumbUrl: "/sample-epaper/page_1.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 11,
      editionId: 1,
      pageNumber: 11,
      pageTitle: "শিক্ষা ও ক্যারিয়ার",
      imageUrl: "/sample-epaper/page_2.svg",
      thumbUrl: "/sample-epaper/page_2.svg",
      widthPx: 1000,
      heightPx: 1450,
    },
    {
      id: 12,
      editionId: 1,
      pageNumber: 12,
      pageTitle: "শেষের পাতা",
      imageUrl: "/sample-epaper/page_1.svg",
      thumbUrl: "/sample-epaper/page_1.svg",
      widthPx: 1000,
      heightPx: 1450,
    }
  ],
  articles: [
    {
      id: 1,
      editionId: 1,
      category: "মেট্রোরেল",
      title: "নিয়ন্ত্রণ নিয়ে দুই সংস্থার রশি-টানাটানি",
      subHeadline: "মেট্রোরেল আইন সংশোধন সড়ক পরিবহন ও মহাসড়ক বিভাগে প্রস্তাব ডিএমটিসিএলের",
      author: "তৌফিকুল ইসলাম, ঢাকা",
      content: `<div class="space-y-4 font-serif-bn">
        <p><strong>তৌফিকুল ইসলাম, ঢাকা</strong> — মেট্রোরেলের নিয়ন্ত্রণ নিয়ে ঢাকা পরিবহন সমন্বয় কর্তৃপক্ষ (ডিটিসিএ) এবং ঢাকা ম্যাস ট্রানজিট কোম্পানি লিমিটেডের (ডিএমটিসিএল) মধ্যে আবার রশি টানাটানি চলছে। মেট্রোরেল পরিষেবাকে 'অত্যাবশ্যক পরিষেবা' ঘোষণার জন্য মেট্রোরেল আইন, ২০১৫ সংশোধনে সড়ক পরিবহন ও মহাসড়ক বিভাগ প্রস্তাব করেছে।</p>
        
        <div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg my-4 text-slate-800 text-sm">
          <p class="font-bold text-amber-900 mb-1">» মূল প্রস্তাবনাসমূহ:</p>
          <ul class="list-disc list-inside space-y-1 text-slate-700">
            <li>মেট্রোরেল আইন সংশোধন সড়ক পরিবহন ও মহাসড়ক বিভাগে প্রস্তাব ডিএমটিসিএলের।</li>
            <li>প্রস্তাবের বিষয়ে মতামত জানতে চেয়ে মহাসড়ক বিভাগের কয়েক দফা চিঠি।</li>
            <li>ডিটিসিএর কার্যপরিধি সংকুচিত হওয়ার আশঙ্কা প্রকাশ সংশ্লিষ্ট মহলের।</li>
          </ul>
        </div>

        <p>সংশ্লিষ্ট সূত্র জানিয়েছে, মেট্রোরেল নির্মাণ ও পরিচালনার দায়িত্বে থাকা ডিএমটিসিএল শুরু থেকেই পূর্ণ স্বায়ত্তশাসন চেয়ে আসছে। অন্যদিকে ডিটিসিএ পুরো রাজধানী ও পার্শ্ববর্তী এলাকার সমন্বিত পরিবহন পরিকল্পনা ও নিয়ন্ত্রণকারী কর্তৃপক্ষ হিসেবে নিজেদের দায়িত্ব অক্ষুণ্ণ রাখতে চায়।</p>
        
        <p>বিশেষজ্ঞরা বলছেন, যাত্রীসেবা নিশ্চিত করতে দুই সংস্থার মধ্যে সুস্থ সমন্বয় জরুরি। প্রশাসনিক মতবিরোধের কারণে মেট্রোরেলের ভবিষ্যৎ সম্প্রসারণ ও পরিচালন যাতে বিঘ্নিত না হয়, সেদিকে মন্ত্রণালয়ের দৃষ্টি দেওয়া প্রয়োজন।</p>
      </div>`,
      featuredImageUrl: "/sample-epaper/page_1.svg",
    },
    {
      id: 2,
      editionId: 1,
      category: "জাতীয়",
      title: "সীমা লঙ্ঘন না করার হুঁশিয়ারি প্রধানমন্ত্রীর",
      subHeadline: "শান্তি ও শৃঙ্খলা বজায় রাখতে সরকার বদ্ধপরিকর",
      author: "বিশেষ প্রতিবেদক, ঢাকা",
      content: `<div class="space-y-4 font-serif-bn">
        <p><strong>বিশেষ প্রতিবেদক, ঢাকা</strong> — দেশের শান্তি, স্থিতিশীলতা ও জনগণের জানমালের নিরাপত্তা রক্ষায় সরকার কোনো ধরনের ছাড় দেবে না বলে সাফ জানিয়ে দিয়েছেন প্রধানমন্ত্রী।</p>
        <p>গতকাল অনুষ্ঠিত এক বিশাল জনসমাবেশে বক্তব্য প্রদানকালে তিনি বলেন, "গণতান্ত্রিক অধিকার চর্চায় সরকার কাউকে বাধা দেয় না, তবে আন্দোলনের নামে সহিংসতা বা জনজীবন বিপর্যস্ত করার চেষ্টা বরদাশত করা হবে না।"</p>
        <p>তিনি উন্নয়ন কার্যক্রমের ধারাবাহিকতা রক্ষায় সকলকে ঐক্যবদ্ধভাবে কাজ করার আহ্বান জানান।</p>
      </div>`,
      featuredImageUrl: "",
    },
    {
      id: 3,
      editionId: 1,
      category: "রাজনীতি",
      title: "আন্দোলন শুরু, সফল করেই ঘরে ফিরব",
      subHeadline: "দাবি আদায় না হওয়া পর্যন্ত আন্দোলন চলমান রাখার ঘোষণা",
      author: "নিজস্ব প্রতিবেদক",
      content: `<div class="space-y-4 font-serif-bn">
        <p><strong>নিজস্ব প্রতিবেদক</strong> — জনগণের মৌলিক অধিকার পুনরুদ্ধার ও নিরপেক্ষ নির্বাচনের দাবিতে চূড়ান্ত আন্দোলন শুরু হয়েছে বলে ঘোষণা দিয়েছেন বিরোধী দলীয় শীর্ষ নেতারা।</p>
        <p>আজকের সমাবেশ থেকে নেতৃবৃন্দ বলেন, "জনগণের সমর্থন আমাদের সাথে রয়েছে। শান্তিপূর্ণ আন্দোলনের মাধ্যমেই দাবি আদায় নিশ্চিত করা হবে।"</p>
      </div>`,
      featuredImageUrl: "",
    },
    {
      id: 4,
      editionId: 1,
      category: "সংসদ",
      title: "লম্বাটে তেল না পুড়িয়ে সংসদে আসুন",
      subHeadline: "গঠনমূলক বিতর্কে অংশ নেওয়ার আহ্বান স্পিকারের",
      author: "সংসদ সচিবালয়",
      content: `<div class="space-y-4 font-serif-bn">
        <p><strong>সংসদ সচিবালয়</strong> — জনগণের প্রতিনিধি হিসেবে সংসদের ফোরামে এসে কার্যকর বক্তব্য উপস্থাপন করতে সকল দলের প্রতি আহ্বান জানিয়েছেন স্পিকার। তিনি বলেন, সংসদের বাইরে অযথা কালক্ষেপণ না করে আইন প্রণয়ন প্রক্রিয়ায় ভূমিকা রাখাই জনপ্রতিনিধিদের মূল দায়িত্ব।</p>
      </div>`,
      featuredImageUrl: "",
    },
    {
      id: 5,
      editionId: 1,
      category: "পরিবেশ ও অর্থনীতি",
      title: "ফুলবাড়ীর কয়লা তোলার ঘোষণায় উদ্বেগ, ক্ষোভ",
      subHeadline: "উন্মুক্ত খনির বিরুদ্ধে স্থানীয় জনগণের ক্ষোভ ও বিক্ষোভ",
      author: "দিনাজপুর প্রতিনিধি",
      content: `<div class="space-y-4 font-serif-bn">
        <p><strong>দিনাজপুর প্রতিনিধি</strong> — দিনাজপুরের ফুলবাড়ীতে উন্মুক্ত পদ্ধতিতে কয়লা উত্তোলনের সিদ্ধান্তের খবরে তীব্র ক্ষোভ ও উদ্বেগ প্রকাশ করেছে স্থানীয় সর্বস্তরের জনগণ ও পরিবেশবাদী সংগঠনগুলো।</p>
        <p>আজ সকালে ফুলবাড়ী শহরের প্রধান সড়কগুলোতে হাজার হাজার মানুষের অংশগ্রহণে প্রতিবাদ মিছিল অনুষ্ঠিত হয়। বক্তারা বলেন, উর্বর কৃষিজমি ও ভূগর্ভস্থ পানির স্তর বিনষ্ট করে কোনো কয়লা প্রকল্প বাস্তবায়ন করা হলে প্রতিরোধ গড়ে তোলা হবে।</p>
      </div>`,
      featuredImageUrl: "",
    },
    {
      id: 6,
      editionId: 1,
      category: "বাণিজ্য ও ফিনটেক",
      title: "দেশজুড়ে রকেট গতিতে হবে লেনদেন - Bangla QR",
      subHeadline: "Bangla QR-এ পেমেন্ট করুন আরও সহজে ও নিরাপদে",
      author: "বিজনেস ডেস্ক",
      content: `<div class="space-y-4 font-serif-bn">
        <p><strong>ঢাকা</strong> — ক্যাশলেস সোসাইটি গঠনের লক্ষ্যে বাংলাদেশ ব্যাংকের নির্দেশনায় দেশজুড়ে সম্প্রসারিত হচ্ছে 'বাংলা কিউআর' (Bangla QR) পেমেন্ট ব্যবস্থা। এখন যেকোনো ব্যাংক বা এমএফএস অ্যাপ দিয়ে একটিমাত্র কিউআর স্ক্যান করেই কেনাকাটা ও বিল পরিশোধ করা যাচ্ছে নিরাপদে ও তাৎক্ষণিকভাবে।</p>
      </div>`,
      featuredImageUrl: "",
    }
  ],
  hotspots: [
    // Page 1 - Hotspot 1: Lead News (Metro Rail)
    {
      id: 1,
      pageId: 1,
      articleId: 1,
      x: 3.0,
      y: 16.5,
      width: 24.0,
      height: 38.0,
      displayOrder: 1,
    },
    // Page 1 - Hotspot 2: Center Story (Prime Minister Warning & Photo)
    {
      id: 2,
      pageId: 1,
      articleId: 2,
      x: 27.5,
      y: 16.5,
      width: 44.0,
      height: 38.0,
      displayOrder: 1,
    },
    // Page 1 - Hotspot 3: Top Right Story (Parliament Speaker)
    {
      id: 3,
      pageId: 1,
      articleId: 3,
      x: 72.5,
      y: 16.5,
      width: 24.5,
      height: 22.0,
      displayOrder: 1,
    },
    // Page 1 - Hotspot 4: Lower Left (Fulbari Coal Mining)
    {
      id: 4,
      pageId: 1,
      articleId: 5,
      x: 3.0,
      y: 56.0,
      width: 45.0,
      height: 26.0,
      displayOrder: 1,
    },
    // Page 1 - Hotspot 5: Bottom Bangla QR Ad
    {
      id: 5,
      pageId: 1,
      articleId: 6,
      x: 3.0,
      y: 83.0,
      width: 94.0,
      height: 14.0,
      displayOrder: 1,
    }
  ]
};

let memoryStore = JSON.parse(JSON.stringify(initialSeedData));

export function getMemoryStore() {
  return memoryStore;
}

export function updateMemoryStore(updater) {
  memoryStore = updater(memoryStore);
  return memoryStore;
}
