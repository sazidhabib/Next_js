import { execSync } from 'child_process';
import fs from 'fs';

// Let's create an evaluation script or use Chrome with a small HTML wrapper or URL
console.log('Testing Chrome screenshot...');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
execSync(`"${chromePath}" --headless --disable-gpu --window-size=1440,900 --screenshot=scratch/about_view.png http://localhost:3001/`);
console.log('Screenshot saved to scratch/about_view.png');
