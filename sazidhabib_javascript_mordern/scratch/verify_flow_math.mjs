// Simulate scroll progress p from 0 to 1
const allFlows = [
  { type: 'intra', clusterIndex: 0, stepIndex: 0, startP: 0.05, endP: 0.25, name: 'Card 1 -> 2' },
  { type: 'intra', clusterIndex: 0, stepIndex: 1, startP: 0.25, endP: 0.45, name: 'Card 2 -> 3' },
  { type: 'bridge', clusterIndex: 0, startP: 0.45, endP: 0.75, name: 'Bridge (Card 3 -> Cluster 2)' },
  { type: 'intra', clusterIndex: 1, stepIndex: 0, startP: 0.75, endP: 0.93, name: 'Card 4 -> 5' }
];

console.log('--- SCROLL SIMULATION TEST ---');
for (let p = 0; p <= 1.01; p += 0.05) {
  const f = p >= 0.58 ? 1 : 0;
  const num = f === 1 ? '02' : '01';
  const states = allFlows.map(fl => {
    let t = 0;
    if (p >= fl.endP) t = 1;
    else if (p > fl.startP) t = (p - fl.startP) / (fl.endP - fl.startP);
    return `${fl.name}: ${(t * 100).toFixed(0)}%`;
  }).join(' | ');

  console.log(`p: ${p.toFixed(2)} | Active: Cluster ${num} | ${states}`);
}

