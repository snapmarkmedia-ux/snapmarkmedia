import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if file uses motion but doesn't import it
  // We can just add `import { motion } from 'framer-motion';` to any file that has `import * as Motion from 'framer-motion';`
  if (content.includes("import * as Motion from 'framer-motion';")) {
    if (!content.includes("import { motion } from 'framer-motion';") && !content.includes("import { motion,")) {
      content = "import { motion } from 'framer-motion';\n" + content;
    }
  }

  // Also catch files that use React hooks but React isn't imported correctly or hooks are destructured from global React
  // If a file has `const { useState } = React;` or similar, we should make sure React is imported.
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Motion imports fixed.');
