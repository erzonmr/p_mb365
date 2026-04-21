#!/usr/bin/env node

import { performance } from 'node:perf_hooks';

const PRIMARY_BASE = 'https://docs-bible-api.netlify.app/.netlify/functions';
const FALLBACK_BASE = 'https://api.scripture.api.bible/v1';
const API_BIBLE_KEY = process.env.API_BIBLE_KEY || 'lKDNAnTqVMi4Mc32rwonP';

const primaryVersions = ['rv1960', 'rv1995', 'nvi', 'dhh', 'pdt'];
const references = ['Genesis 1', 'Salmos 1', 'Juan 3', 'Romanos 8', 'Apocalipsis 1'];

const fallbackVersions = {
  NTV: '826f63861180e056-01',
  NBLA: 'ce11b813f9a27e20-01',
  LBLA: 'e3f420b9665abaeb-01',
};

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function timedFetch(url, options = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const elapsed = performance.now() - start;
    return { ok: response.ok, status: response.status, elapsedMs: elapsed, headers: response.headers };
  } catch (error) {
    const elapsed = performance.now() - start;
    return { ok: false, status: null, elapsedMs: elapsed, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function testPrimaryApi() {
  const results = [];
  for (const version of primaryVersions) {
    for (const reference of references) {
      const url = `${PRIMARY_BASE}/api/chapter?reference=${encodeURIComponent(reference)}&version=${encodeURIComponent(version)}`;
      const res = await timedFetch(url);
      results.push({ provider: 'primary', version, reference, ...res, cors: res.headers?.get('access-control-allow-origin') || null });
    }
  }
  return results;
}

async function testFallbackApi() {
  const results = [];
  for (const [label, bibleId] of Object.entries(fallbackVersions)) {
    const url = `${FALLBACK_BASE}/bibles/${bibleId}/books`;
    const res = await timedFetch(url, {
      headers: { 'api-key': API_BIBLE_KEY },
    });
    results.push({ provider: 'fallback', version: label, bibleId, endpoint: 'books', ...res, rateLimit: res.headers?.get('x-ratelimit-limit') || null });
  }
  return results;
}

function summarize(results) {
  const times = results.filter((r) => r.elapsedMs != null).map((r) => r.elapsedMs);
  const errors = results.filter((r) => !r.ok).length;
  const corsAllowed = results.filter((r) => r.provider === 'primary').every((r) => !!r.cors);
  return {
    totalRequests: results.length,
    successfulRequests: results.length - errors,
    errorRate: Number((errors / Math.max(1, results.length)).toFixed(3)),
    p95Ms: Number((percentile(times, 95) ?? 0).toFixed(2)),
    avgMs: Number((times.reduce((a, b) => a + b, 0) / Math.max(1, times.length)).toFixed(2)),
    corsDetected: corsAllowed,
  };
}

async function main() {
  const primary = await testPrimaryApi();
  const fallback = await testFallbackApi();

  const report = {
    executedAtUtc: new Date().toISOString(),
    primarySummary: summarize(primary),
    fallbackSummary: summarize(fallback),
    primary,
    fallback,
  };

  console.log(JSON.stringify(report, null, 2));
}

main();
