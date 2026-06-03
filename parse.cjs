const fs = require('fs');
const html = fs.readFileSync('output.html', 'utf8');

// remove scripts, styles
let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
               .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

// extract all tags, keep texts
const plainText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

fs.writeFileSync('text.txt', plainText);
console.log('Saved to text.txt');
