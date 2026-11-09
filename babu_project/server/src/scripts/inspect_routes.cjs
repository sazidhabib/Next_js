const fs = require('fs');
const html = fs.readFileSync('server/src/scripts/home_dump.html', 'utf8');

const match = html.match(/const Ziggy=(\{.*?\});/);
if (match) {
  const ziggy = JSON.parse(match[1]);
  const routes = Object.keys(ziggy.routes);
  const publicRoutes = routes.filter(r => !r.startsWith('admin.'));
  console.log('--- ALL FRONTEND / PLAYER / CASINO ROUTES ---');
  publicRoutes.forEach(r => {
    console.log(r, '->', ziggy.routes[r].uri);
  });
}

