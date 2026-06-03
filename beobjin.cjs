const https = require('https');
const fs = require('fs');

https.get('https://beobjin-criminal.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('beobjin.html', data);
    console.log('Saved to beobjin.html');
  });
}).on('error', (err) => console.log('Error: ' + err.message));
