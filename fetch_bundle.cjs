const https = require('https');
const fs = require('fs');

https.get('https://www.voicephishingdefense.com/assets/index-CCGsvx_L.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('bundle.js', data);
    console.log('Saved bundle.js, size:', data.length);
  });
}).on('error', (err) => console.log('Error: ' + err.message));
