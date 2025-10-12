#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetUid = process.argv[2];

if (!targetUid) {
  console.error('Usage: node scripts/check-registry.js <uid>');
  process.exit(1);
}

const sourcePath = path.join(__dirname, '..', 'app', 'page.js');
let source;

try {
  source = fs.readFileSync(sourcePath, 'utf8');
} catch (error) {
  console.error(`Failed to read file at ${sourcePath}:`, error.message);
  process.exit(1);
}

const encodedKey = Buffer.from(targetUid, 'utf8').toString('base64');
const ledgerMatch = source.match(/const\s+murkyLedger\s*=\s*{([\s\S]*?)^\s*};/m);

if (!ledgerMatch) {
  console.error('Unable to locate murkyLedger definition in app/page.js');
  process.exit(1);
}

const ledgerBody = ledgerMatch[1];
const pairRegex = new RegExp(`['"]${encodedKey}['"]\\s*:\\s*['"]([^'"]+)['"]`);
const pairMatch = pairRegex.exec(ledgerBody);

if (!pairMatch) {
  console.error(`UID ${targetUid} (base64: ${encodedKey}) not found in murkyLedger`);
  process.exit(1);
}

const encodedPayload = pairMatch[1];
let decodedPayload;

try {
  decodedPayload = Buffer.from(encodedPayload, 'base64').toString('utf8');
} catch (error) {
  console.error(`Failed to decode value for UID ${targetUid}:`, error.message);
  process.exit(1);
}

let metadata;

try {
  metadata = JSON.parse(decodedPayload);
} catch (error) {
  console.error(`Decoded payload for UID ${targetUid} is not valid JSON:`, error.message);
  process.exit(1);
}

if (!metadata.expiration) {
  console.error(`No expiration field found for UID ${targetUid}`);
  process.exit(1);
}

const expiration = new Date(metadata.expiration);

if (Number.isNaN(expiration.getTime())) {
  console.error(`Expiration value for UID ${targetUid} is not a valid date: ${metadata.expiration}`);
  process.exit(1);
}

const now = Date.now();

if (expiration.getTime() <= now) {
  console.error(
    `UID ${targetUid} is expired as of ${expiration.toISOString()} (current time: ${new Date(now).toISOString()})`,
  );
  process.exit(1);
}

console.log(
  `UID ${targetUid} is registered with expiration ${expiration.toISOString()} (base64 key ${encodedKey}).`,
);
