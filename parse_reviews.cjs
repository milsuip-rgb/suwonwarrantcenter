const fs = require('fs');
const bundle = fs.readFileSync('bundle.js', 'utf8');

const regex = /.{0,50}후기.{0,50}/g;
const matches = bundle.match(regex);
if (matches) {
  const unique = [...new Set(matches)];
  fs.writeFileSync('reviews.txt', unique.join('\n'));
}
