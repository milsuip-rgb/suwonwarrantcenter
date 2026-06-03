const fs = require('fs');
const bundle = fs.readFileSync('bundle.js', 'utf8');

const regex = /.{0,30}0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}.{0,30}/g;
const matches = bundle.match(regex);
if (matches) {
  const unique = [...new Set(matches)];
  fs.writeFileSync('phones.txt', unique.join('\n'));
}
