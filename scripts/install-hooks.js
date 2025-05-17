import { copyFileSync, chmodSync } from 'fs';
import { resolve } from 'path';

const hookPath = resolve('../.git/hooks/pre-commit');
const hookSource = resolve('./pre-commit');

try {
  copyFileSync(hookSource, hookPath);
  chmodSync(hookPath, 0o755);
  console.log('Git hook "pre-commit" installed.');
} catch (e) {
  console.error('Failed to install pre-commit hook:', e.message);
}