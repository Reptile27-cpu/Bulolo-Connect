const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const target = path.join(distDir, 'server.js');
const content = `// Runtime entry point delegating to compiled backend server\nmodule.exports = require('./backend/src/server.js');\n`;

fs.writeFileSync(target, content, 'utf8');
console.log('✓ Created dist/server.js runtime entrypoint');
