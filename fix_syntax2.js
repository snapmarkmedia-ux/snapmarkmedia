import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  if (file === 'main.jsx') return;
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  let hoistedImports = [];

  // Remove any imports inside functions and hoist them
  content = content.replace(/import\s+.*?;/g, (match) => {
     hoistedImports.push(match);
     return '';
  });

  // Unique imports
  hoistedImports = [...new Set(hoistedImports)];

  // Inject at the top
  content = hoistedImports.join('\n') + '\n\n' + content;

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Imports hoisted.');
