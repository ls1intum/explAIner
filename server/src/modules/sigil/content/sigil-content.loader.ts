import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { SigilLang } from '../sigil.config';

@Injectable()
export class SigilContentLoader implements OnModuleInit {
  private content: Record<SigilLang, string[]> = { de: [], en: [] };

  onModuleInit() {
    this.content.de = this.loadAndSplit('sigil-de.md');
    this.content.en = this.loadAndSplit('sigil-en.md');
  }

  getSections(lang: SigilLang, from: number, to: number): string {
    return this.content[lang].slice(from - 1, to).join('\n\n');
  }

  getAllSections(lang: SigilLang): string {
    return this.content[lang].join('\n\n');
  }

  private loadAndSplit(filename: string): string[] {
    const filePath = this.resolveContentPath(filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return raw
      .split(/<!--\s*SECTION\s+\d+\s*-->/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // nest build emits the compiled JS under dist/src/... but copies the .md
  // assets to dist/modules/... (it strips the sourceRoot). The production image
  // ships only dist/, so resolve against the locations that actually exist in
  // both the compiled (dev + prod) and the ts-node source layouts.
  private resolveContentPath(filename: string): string {
    const candidates = [
      path.join(process.cwd(), 'dist', 'modules', 'sigil', 'content', filename),
      path.join(process.cwd(), 'src', 'modules', 'sigil', 'content', filename),
      path.join(__dirname, filename),
    ];
    const found = candidates.find((p) => fs.existsSync(p));
    if (!found) {
      throw new Error(
        `Sigil content "${filename}" not found. Looked in:\n${candidates.join('\n')}`,
      );
    }
    return found;
  }
}
