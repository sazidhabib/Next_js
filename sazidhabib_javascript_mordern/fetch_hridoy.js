import https from 'https';

https.get('https://hridoy.pro/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    console.log('--- JS from line 2870 to 2930 ---');
    for (let i = 2870; i < 2930; i++) {
      if (lines[i]) console.log(i + 1, lines[i]);
    }
  });
}).on('error', err => console.log('Err:', err.message));
