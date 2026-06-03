const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const s3Start = code.indexOf('{/* SECTION 3: WHAT REALLY MATTERS (EDUCATION) */}');
const s4Start = code.indexOf('{/* SECTION 4: SUCCESS CASES */}');
const s5Start = code.indexOf('{/* SECTION 5: PROCESS */}');

const beforeS3 = code.substring(0, s3Start);
const s3 = code.substring(s3Start, s4Start);
const s4 = code.substring(s4Start, s5Start);
const afterS5 = code.substring(s5Start);

const newCode = beforeS3 + s4 + s3 + afterS5;
fs.writeFileSync('src/pages/Home.tsx', newCode);
