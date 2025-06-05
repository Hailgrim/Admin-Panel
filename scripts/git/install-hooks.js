import { copyFileSync, chmodSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const hookPath = resolve(__dirname, '../../.git/hooks/pre-commit');
const hookSource = resolve(__dirname, './pre-commit');

try {
  copyFileSync(hookSource, hookPath);
  chmodSync(hookPath, 0o755);
  console.info('Git hook "pre-commit" installed.');
} catch (e) {
  console.error('Failed to install pre-commit hook:', e.message);
}
