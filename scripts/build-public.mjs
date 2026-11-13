import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

// Only these files belong in the public static site. Repository, operational,
// test, and backend files stay outside the deployment output directory.
const files = [
  'index.html', 'app.js', 'data.js', 'expanded-curriculum.js', 'cloud-config.js', 'cloud.js',
  'styles.css', 'icon.svg', 'manifest.webmanifest', 'sw.js', 'robots.txt',
  'privacy.html', 'terms.html', 'verify.html', 'verify.js', 'verify.css',
  'resources/phone-to-desktop-roadmap.md',
  'resources/technical-references.html',
  ...[1, 2, 3, 4, 5].map(n => `resources/project-${n}-brief.md`),
  'pilot/index.html', 'pilot/app.js', 'pilot/metrics.js', 'pilot/styles.css',
];
const output = 'vercel-output';
rmSync(output, { recursive: true, force: true });
for (const file of files) {
  const destination = join(output, file);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(file, destination);
}
console.log(`Prepared ${files.length} public files.`);
