import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  if (file === 'main.jsx') return;
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace global window assignments with exports
  content = content.replace(/window\.([A-Za-z0-9_]+)\s*=\s*\1;/g, 'export default $1;');

  // If a file assigns multiple things to window, we need to handle that or manually fix.
  // For now, let's also remove `const { motion, ... } = Motion;` and replace with `import { motion, ... } from 'framer-motion';`
  
  // Replace React destructuring: const { useState } = React; => import React, { useState } from 'react';
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*React;/g, "import React, { $1 } from 'react';");
  
  // Replace Motion destructuring
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*Motion;/g, "import * as Motion from 'framer-motion';\nconst { $1 } = Motion;");

  // Fix assets paths, they should just work since they are in public/assets. Wait, no change needed for string literals starting with "assets/".

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Migration script complete.');
