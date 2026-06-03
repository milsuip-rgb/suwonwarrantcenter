const fs = require('fs');
const bundle = fs.readFileSync('bundle.js', 'utf8');

const regex = /.{0,50}(?:캡처|감사합니다|고맙습니다|정말|다행히|변호사님|덕분에|최고|안심).{0,50}/g;
const matches = bundle.match(regex);
if (matches) {
  const unique = [...new Set(matches)];
  fs.writeFileSync('thanks.txt', unique.join('\n'));
}
