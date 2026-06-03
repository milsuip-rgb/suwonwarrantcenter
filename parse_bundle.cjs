const fs = require('fs');
const bundle = fs.readFileSync('bundle.js', 'utf8');

const regex = /.{0,60}(?:전화|주소|대표|의뢰인|법무법인).{0,60}/g;
const matches = bundle.match(regex);
if (matches) {
  const unique = [...new Set(matches)];
  fs.writeFileSync('info.txt', unique.join('\n'));
}
