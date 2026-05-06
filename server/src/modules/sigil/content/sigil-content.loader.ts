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
    const filePath = path.join(process.cwd(), 'src', 'modules', 'sigil', 'content', filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return raw
      .split(/<!--\s*SECTION\s+\d+\s*-->/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
}
