import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

const exportMap = {};

// 1. Fix multiple export defaults and map exports
files.forEach(file => {
  if (file === 'main.jsx') return;
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find all export default statements that were created by previous script
  const exportMatches = [...content.matchAll(/export default ([A-Za-z0-9_]+);/g)];
  if (exportMatches.length > 1) {
    const exports = exportMatches.map(m => m[1]);
    content = content.replace(/export default [A-Za-z0-9_]+;\n?/g, '');
    content += `\nexport { ${exports.join(', ')} };\n`;
    exports.forEach(exp => exportMap[exp] = { file, isDefault: false });
  } else if (exportMatches.length === 1) {
    exportMap[exportMatches[0][1]] = { file, isDefault: true };
  } else if (file === 'ServicesData.jsx') {
      // Special case: ServicesData had window.SERVICES_DATA = SERVICES_DATA;
      content = content.replace(/window\.SERVICES_DATA\s*=\s*SERVICES_DATA;/g, 'export const SERVICES_DATA = _SERVICES_DATA; // handled');
      // Wait, let's just make sure SERVICES_DATA is exported.
      if (!content.includes('export const SERVICES_DATA')) {
          content = content.replace('const SERVICES_DATA', 'export const SERVICES_DATA');
      }
      exportMap['SERVICES_DATA'] = { file, isDefault: false };
  }

  // Also catch things like window.AmbientEffects = AmbientEffects
  if (!exportMatches.length) {
     const fnMatch = content.match(/function\s+([A-Z][a-zA-Z0-9_]*)/);
     if (fnMatch) {
        content += `\nexport default ${fnMatch[1]};\n`;
        exportMap[fnMatch[1]] = { file, isDefault: true };
     }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
});

// Add explicit mapping for icons
exportMap['ArrowUpRight'] = { file: 'icons.jsx', isDefault: false };
exportMap['PlayIcon'] = { file: 'icons.jsx', isDefault: false };
exportMap['ClockIcon'] = { file: 'icons.jsx', isDefault: false };
exportMap['GlobeIcon'] = { file: 'icons.jsx', isDefault: false };
exportMap['TestimonialCard'] = { file: 'ReviewsSection.jsx', isDefault: false };
exportMap['PortraitCard'] = { file: 'ProfileSection.jsx', isDefault: false };


// 2. Inject imports based on usage
files.forEach(file => {
  if (file === 'main.jsx') return;
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let imports = [];

  // Basic React import
  if (content.includes('React') || content.includes('<') || content.includes('useEffect') || content.includes('useState')) {
    if (!content.includes("import React")) {
       imports.push(`import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';`);
    }
  }

  // Framer Motion
  if (content.includes('motion.') || content.includes('m.') || content.includes('Motion.')) {
     if (!content.includes("framer-motion")) {
        imports.push(`import { motion, useTransform, useMotionValue, useScroll, useSpring, AnimatePresence } from 'framer-motion';`);
     }
  }

  // Check usage of other components
  Object.keys(exportMap).forEach(component => {
    // If the component is used in this file (and not defined in this file)
    const regex = new RegExp(`\\b${component}\\b`);
    if (regex.test(content) && exportMap[component].file !== file) {
      const isDef = exportMap[component].isDefault;
      const importPath = `./${exportMap[component].file.replace('.jsx', '').replace('.js', '')}`;
      if (isDef) {
        imports.push(`import ${component} from '${importPath}';`);
      } else {
        imports.push(`import { ${component} } from '${importPath}';`);
      }
    }
  });

  // Check specific global replacements
  content = content.replace(/window\.SERVICES_DATA/g, 'SERVICES_DATA');
  content = content.replace(/window\.innerWidth/g, 'window.innerWidth'); // ignore

  // Framer motion destructurings fix:
  content = content.replace(/const\s+\{\s*motion:[A-Za-z0-9_]+\s*\}\s*=\s*Motion;/g, '');
  content = content.replace(/const\s+\{\s*motion\s*\}\s*=\s*Motion;/g, '');
  content = content.replace(/const\s+\{\s*motion\s*:\s*([A-Za-z0-9_]+)\s*\}\s*=\s*Motion;/g, 'const $1 = motion;');
  
  // React destructuring fixes:
  content = content.replace(/const\s+\{\s*(useState|useEffect|useRef|useMemo|useCallback)[^}]*\}\s*=\s*React;/g, '');

  if (imports.length > 0) {
     // deduplicate
     imports = [...new Set(imports)];
     content = imports.join('\n') + '\n\n' + content;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Imports injected.');
