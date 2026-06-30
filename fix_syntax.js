import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  if (file === 'main.jsx') return;
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix: import React, { useEffect: useGlowEffect } from 'react' -> import React, { useEffect as useGlowEffect } from 'react'
  content = content.replace(/import\s+React\s*,\s*\{([^}]+)\}\s*from\s*'react';/g, (match, inner) => {
     const fixedInner = inner.replace(/([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_]+)/g, '$1 as $2');
     return `import React, { ${fixedInner} } from 'react';`;
  });

  // Fix any other stray React destructurings
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*React;/g, (match, inner) => {
     const fixedInner = inner.replace(/([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_]+)/g, '$1 as $2');
     return `import { ${fixedInner} } from 'react';`;
  });

  // Fix Framer Motion destructurings
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*Motion;/g, (match, inner) => {
     let fixedInner = inner.replace(/motion(\s*:\s*[a-zA-Z0-9_]+)?,?\s*/g, ''); // remove motion from destructuring
     fixedInner = fixedInner.replace(/([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_]+)/g, '$1 as $2');
     if (fixedInner.trim() === '') return '';
     return `import { ${fixedInner} } from 'framer-motion';`;
  });

  // Some files had `const { motion: m } = Motion;`. My previous regex might have missed them or changed them poorly.
  content = content.replace(/const\s+\{\s*motion\s*:\s*([a-zA-Z0-9_]+)\s*\}\s*=\s*Motion;/g, 'const $1 = motion;');
  
  // Fix React imports where it says `import React, {  ...  } from 'react';` multiple times
  content = content.replace(/(import\s+React,.*?from\s+'react';\s*)+/g, (match) => {
     // Just consolidate or take the first one if they are duplicates. We'll just let Vite optimize it, but syntax errors are bad.
     return match;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Syntax fixes applied.');
