/**
 * fix-build-paths.js
 * 
 * Run this AFTER `npm run build` on Windows, BEFORE uploading .next to cPanel.
 * It converts Windows backslash paths in the .next build output to Linux forward slashes,
 * so the build can run correctly on a Linux cPanel server.
 * 
 * Usage: node fix-build-paths.js
 */

const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');

// Files that may contain Windows backslash paths
const filesToFix = [
    'required-server-files.json',
    'required-server-files.js',
    'prerender-manifest.json',
    'routes-manifest.json',
    'build-manifest.json',
    'app-path-routes-manifest.json',
    'server/app-paths-manifest.json',
    'server/pages-manifest.json',
    'server/middleware-manifest.json',
    'server/middleware-build-manifest.js',
    'server/functions-config-manifest.json',
    'server/server-reference-manifest.js',
    'server/server-reference-manifest.json',
    'server/next-font-manifest.js',
    'server/next-font-manifest.json',
];

let fixedCount = 0;

filesToFix.forEach(file => {
    const filePath = path.join(nextDir, file);
    if (!fs.existsSync(filePath)) {
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Replace Windows drive paths like D:\\Github\\realsteat_next - javascript
    // with empty string (relative path) for appDir, turbopack.root, etc.
    content = content.replace(/[A-Z]:\\\\[^"']*/g, (match) => {
        // Only wipe absolute Windows directory paths (appDir, turbopack root)
        // These get resolved at runtime on the server relative to cwd
        return '';
    });

    // Replace remaining .next\\server\\file paths with .next/server/file
    content = content.replace(/\\.next\\\\([^"']*)/g, (match) => {
        return match.replace(/\\\\/g, '/');
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
        console.log(`✓ Fixed: ${file}`);
    } else {
        console.log(`  Skipped (no changes needed): ${file}`);
    }
});

console.log(`\nDone! Fixed ${fixedCount} file(s).`);
console.log('You can now upload the .next folder to your cPanel server.');
