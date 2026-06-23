const fs = require('fs');
const path = require('path');

const toDelete = ['Login.jsx', 'Register.jsx', 'Logout.jsx', 'ProtectedAdminRoute.jsx'];
toDelete.forEach(f => {
  const p = path.join('app/components', f);
  if(fs.existsSync(p)) fs.unlinkSync(p);
});

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            
            if (!content.includes('"use client"')) {
                content = '"use client";\n' + content;
                changed = true;
            }
            
            if (content.includes('react-router-dom')) {
                content = content.replace(/import\s+\{\s*Link\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';");
                content = content.replace(/import\s+\{\s*useLocation\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import { usePathname as useLocation } from 'next/navigation';");
                content = content.replace(/import\s+\{\s*useParams,\s*Link\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import { useParams } from 'next/navigation';\nimport Link from 'next/link';");
                content = content.replace(/import\s+\{\s*Link,\s*useParams\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import { useParams } from 'next/navigation';\nimport Link from 'next/link';");
                changed = true;
            }

            if (content.includes('import.meta.env')) {
                content = content.replace(/import\.meta\.env\.VITE_API_BASE_URL/g, "''");
                changed = true;
            }
            
            if (changed) {
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}

processDir('app/components');
console.log('Migration script finished!');
