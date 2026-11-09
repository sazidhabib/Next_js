const https = require('https');
const fs = require('fs');

https.get('https://casinogame.ihookwebsolutions.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('server/src/scripts/home_dump.html', data);
    console.log('Saved home_dump.html, length:', data.length);

    const appMatch = data.match(/data-page="([^"]+)"/);
    if (appMatch) {
      const decoded = appMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#039;/g, "'");

      try {
        const parsed = JSON.parse(decoded);
        console.log('=== INERTIA COMPONENT ===');
        console.log(parsed.component);
        console.log('=== PROPS KEYS ===');
        console.log(Object.keys(parsed.props));
        fs.writeFileSync('server/src/scripts/home_props.json', JSON.stringify(parsed, null, 2));
        console.log('Saved home_props.json');
      } catch (err) {
        console.error('JSON parse error:', err);
      }
    }
  });
});

