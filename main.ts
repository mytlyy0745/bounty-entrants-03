// bounty-entrants-03 entry: hands the house the list of bounties this account
// sponsored, so their counted entrants add up to this entry's score.
//
// BOUNTY.json (repository root) holds the bounty pages, one per item:
//   {"bounties": ["https://make.fun/bounty/<slug>", ...]}
// This program reads that file and writes it, unchanged, to the output
// directory as BOUNTY.json, where the gate reads it. The entry itself is
// the bounties: the house counts their entrants in make.fun's own database.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'BOUNTY.json');
const target = join(outDir, 'BOUNTY.json');

let raw;
try {
  raw = readFileSync(source, 'utf8');
} catch (err) {
  console.error(`could not read ${source}: ${(err as Error).message}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`BOUNTY.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

if (!Array.isArray(data.bounties) || data.bounties.length === 0) {
  console.error('BOUNTY.json names no bounties: add at least one bounty page.');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, JSON.stringify(data, null, 2) + '\n');
console.log(`wrote ${data.bounties.length} ${data.bounties.length === 1 ? 'bounty' : 'bounties'} to ${target}`);
for (const url of data.bounties) console.log(`  - ${url}`);
