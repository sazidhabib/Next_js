const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const workItems = [
  { id: 1, title: "Campaigns", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80", color: "from-orange-500 to-amber-400", link: "/protfolio?category=Campaigns" },
  { id: 2, title: "Audio Visuals", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80", color: "from-purple-500 to-pink-400", link: "/protfolio?category=Audio%20Visuals" },
  { id: 3, title: "Creatives", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", color: "from-blue-500 to-cyan-400", link: "/protfolio?category=Creatives" },
  { id: 4, title: "Printing and Packaging", image: "/Printing-packagi.png", color: "from-green-500 to-emerald-400", link: "/protfolio?category=Printing%20%26%20Packaging" },
  { id: 5, title: "Events and Activations", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", color: "from-rose-500 to-red-400", link: "/protfolio?category=Events%20and%20Activations" },
  { id: 6, title: "Website", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", color: "from-indigo-500 to-violet-400", link: "/protfolio?category=Website" }
];

const caseStudies = [
  { id: 1, title: "Turning Conversations into Conversions: The Lead Generation Success Story of Western Consulting Firm", category: "Lead Generation", image: "/Case-study.jpg", link: "/case-study/western-consulting" },
  { id: 2, title: "From Zero to High-Intent Traffic: How Mostofa Pipe Built SEO Visibility in Just 5 Months", category: "SEO", image: "/CaseStudy2.jpg", link: "/case-study/mostofa-pipe" },
  { id: 3, title: "How Next Idea Solution Drove 300X ROAS for Urban's Premium Real Estate Project in Dhaka", category: "Real Estate", image: "/case-study3.jpg", link: "/case-study/urban-imperials" }
];

const additionalSettings = [
  { key: 'global_work', value: JSON.stringify(workItems), type: 'json', description: 'Global Work/Portfolio Categories' },
  { key: 'global_case_studies', value: JSON.stringify(caseStudies), type: 'json', description: 'Global Case Studies' },
  { key: 'home_work', value: JSON.stringify(workItems), type: 'json', description: 'Home Page Work Section' },
  { key: 'home_case_studies', value: JSON.stringify(caseStudies), type: 'json', description: 'Home Page Case Studies' }
];

let newKeysString = '';
additionalSettings.forEach(k => {
  newKeysString += `  { key: '${k.key}', value: JSON.stringify(${k.value}), type: '${k.type}', description: '${k.description}' },\n`;
});

// Insert before the end of the array
content = content.replace(/\];\s*$/, ',\n' + newKeysString + '];');
content = content.replace(/},\s*,\n/g, '},\n');

fs.writeFileSync(defaultsPath, content);
console.log('Added work and case study settings successfully');
