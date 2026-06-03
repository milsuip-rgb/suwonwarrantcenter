const https = require('https');
const fs = require('fs');

https.get('https://www.voicephishingdefense.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('output.html', data);
    console.log('Saved to output.html');
  });
}).on('error', (err) => console.log('Error: ' + err.message));
