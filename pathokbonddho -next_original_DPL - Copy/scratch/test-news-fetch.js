const axios = require('axios');

async function testFetch() {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/news?tag=ভিডিও&limit=5');
        const news = res.data.news || res.data.rows || res.data.data;
        news.map((n, i) => console.log(`${i}: ${n.id} - ${n.newsHeadline}`));
    } catch(e) {
        console.error(e.message);
    }
}

testFetch();
