import {existsSync, mkdir} from 'node:fs';

export function mkdirp(path: string): void {
  if (existsSync(path)) return;
  mkdir(path, {recursive: true}, (err) => {
    if (err) throw err;
  });
}
