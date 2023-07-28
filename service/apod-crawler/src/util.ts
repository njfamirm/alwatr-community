import {existsSync, mkdirSync} from 'node:fs';

export async function mkdirp(path: string): Promise<void> {
  if (existsSync(path)) return;
  mkdirSync(path, {recursive: true});
}
