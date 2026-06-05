const fs = require('fs');
const path = require('path');

function walk(d, list=[]) {
  if (!fs.existsSync(d)) return list;
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (p.endsWith('.js') || p.endsWith('.jsx')) list.push(p);
  });
  return list;
}
dd
const files = walk('./src');
const urls = new Set();
const routeRegex = /axios\.(get|post|patch|delete|put)\((?:`|'|")([^`'"]+)(?:`|'|")/g;

files.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = routeRegex.exec(code)) !== null) {
    const method = match[1].toUpperCase();
    let url = match[2];
    if (url.includes('${')) {
      url = url.replace(/\$\{([^}]+)\}/g, '[$1]');
    }
    urls.add(`${method} ${url}`);
  }
});

console.log(Array.from(urls).sort().join('\n'));
