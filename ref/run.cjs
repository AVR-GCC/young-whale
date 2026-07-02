const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const replacement = fs.readFileSync('replacement.txt', 'utf8');

const startMarker = '{/* Main Grid View */}';
const endMarker = '{/* Filtered Container View */}';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.log('MARKERS NOT FOUND');
  process.exit(1);
}

const actualStart = code.lastIndexOf('\n', startIdx);
code = code.substring(0, actualStart) + '\n' + replacement + '\n          ' + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', code);
console.log('Successfully Replaced Grid Code!');
