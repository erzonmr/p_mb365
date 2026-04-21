#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const jsonDir = path.resolve('json');
const files = fs.readdirSync(jsonDir).filter((file) => file.endsWith('.json'));

const issues = [];
const summary = [];

for (const file of files) {
  const fullPath = path.join(jsonDir, file);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(raw);

    if (Array.isArray(data)) {
      const isPlan = data.every((entry) => typeof entry?.dia === 'number' && Array.isArray(entry?.porciones));
      summary.push({ file, type: isPlan ? 'plan' : 'array', entries: data.length });

      if (isPlan) {
        const expectedDays = data.map((d) => d.dia);
        const isSequential = expectedDays.every((day, idx) => day === idx + 1);
        if (!isSequential) issues.push(`${file}: los días no son secuenciales desde 1.`);
      }
    } else if (typeof data === 'object' && data !== null) {
      if (file === 'versiculos-diarios.json') {
        const totalDays = data?.meta?.totalDays;
        const count = Array.isArray(data?.dailyVerses) ? data.dailyVerses.length : 0;
        summary.push({ file, type: 'daily_verse', declaredDays: totalDays, entries: count });
        if (totalDays !== count) issues.push(`${file}: meta.totalDays=${totalDays} no coincide con entries=${count}.`);
      } else {
        summary.push({ file, type: 'object', keys: Object.keys(data).length });
      }
    } else {
      issues.push(`${file}: formato JSON no soportado.`);
    }
  } catch (error) {
    issues.push(`${file}: JSON inválido (${error.message}).`);
  }
}

console.log(JSON.stringify({
  executedAtUtc: new Date().toISOString(),
  filesChecked: files.length,
  summary,
  issues,
  passed: issues.length === 0,
}, null, 2));
