// scripts/replace-img.js
import fs from 'fs';
import path from 'path';

const DIR = './app'; // adjust to your source folder

function replaceImgWithNextImage(filePath) {
  let code = fs.readFileSync(filePath, 'utf-8');
  if (!code.includes('<img')) return;

  // simple replacement: <img src="..." alt="..."/> -> <Image src="..." alt="..." width={500} height={300} />
  code = code.replace(
    /<img\s+([^>]+)\/?>/g,
    (match, attrs) => {
      let width = '500';
      let height = '300';

      // try to preserve width/height if present
      const widthMatch = attrs.match(/width=["'](\d+)["']/);
      const heightMatch = attrs.match(/height=["'](\d+)["']/);
      if (widthMatch) width = widthMatch[1];
      if (heightMatch) height = heightMatch[1];

      return `<Image ${attrs} width={${width}} height={${height}} />`;
    }
  );

  // add import if missing
  if (!code.includes("import Image from 'next/image'")) {
    code = "import Image from 'next/image';\n" + code;
  }

  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Updated: ${filePath}`);
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) walkDir(fullPath);
    else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) replaceImgWithNextImage(fullPath);
  });
}

walkDir(DIR);
