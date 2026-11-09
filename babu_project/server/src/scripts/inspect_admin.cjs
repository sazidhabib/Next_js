const https = require('https');
const fs = require('fs');

https.get('https://casinogame.ihookwebsolutions.com/build/assets/AdminLayout-CVCc2tws.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('server/src/scripts/admin_layout_dump.js', data);
    console.log('Downloaded AdminLayout js, size:', data.length);

    // Search for navigation arrays or menu structures
    const navMatch = data.match(/navigation\s*=\s*(\[.*?\])/s) || data.match(/menuItems\s*=\s*(\[.*?\])/s);
    if (navMatch) {
      console.log('Found navigation array:', navMatch[1].slice(0, 500));
    } else {
      // Find occurrences of route('admin.
      const routeCalls = [...data.matchAll(/route\(\s*['"](admin\.[a-zA-Z0-9_\-\.]+)['"]\s*\)/g)].map(m => m[1]);
      console.log('Unique route calls:', [...new Set(routeCalls)]);
    }
  });
});

