const https = require('https');
const fs = require('fs');

function download(url, filename) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync(filename, data);
      console.log(`Downloaded ${filename}, size: ${data.length}`);
    });
  });
}

download('https://casinogame.ihookwebsolutions.com/build/assets/Welcome-ONWEAI1v.js', 'server/src/scripts/Welcome.js');
download('https://casinogame.ihookwebsolutions.com/build/assets/CasinoApp-BJDeaGAI.js', 'server/src/scripts/CasinoApp.js');

