#!/usr/bin/env node
// Temporary diagnostic — checks the SHAPE of CLIENT_USERNAME and
// CLIENT_PASSWORD_HASH without printing their actual values, and
// tests a given password against the stored hash. Delete this file
// once login is working; it's not part of the app.
//
// Usage: node --env-file=.env.local scripts/debug-login.mjs "Ap20069."
import crypto from "node:crypto";

const testPassword = process.argv[2];

const username = process.env.CLIENT_USERNAME;
const hash = process.env.CLIENT_PASSWORD_HASH;
const sessionSecret = process.env.SESSION_SECRET;

console.log("--- CLIENT_USERNAME ---");
if (username === undefined) {
  console.log("NOT SET (undefined) — the variable is missing from .env.local entirely.");
} else {
  console.log(`Length: ${username.length}`);
  console.log(`Expected "Admin_Alpp" is length: ${"Admin_Alpp".length}`);
  console.log(`Exact match to "Admin_Alpp": ${username === "Admin_Alpp"}`);
  console.log(`Has leading/trailing whitespace: ${username !== username.trim()}`);
  console.log(`First char code: ${username.charCodeAt(0)}, Last char code: ${username.charCodeAt(username.length - 1)}`);
}

console.log("\n--- CLIENT_PASSWORD_HASH ---");
if (hash === undefined) {
  console.log("NOT SET (undefined) — the variable is missing from .env.local entirely.");
} else {
  console.log(`Total length: ${hash.length} (expected: 161 — 32 salt hex chars + 1 colon + 128 hash hex chars)`);
  const parts = hash.trim().split(":");
  console.log(`Number of ':' separated parts: ${parts.length} (expected: 2)`);
  if (parts.length === 2) {
    console.log(`Salt part length: ${parts[0].length} (expected: 32)`);
    console.log(`Hash part length: ${parts[1].length} (expected: 128)`);
    console.log(`Salt looks like valid hex: ${/^[0-9a-f]+$/i.test(parts[0])}`);
    console.log(`Hash looks like valid hex: ${/^[0-9a-f]+$/i.test(parts[1])}`);
  }
}

console.log("\n--- SESSION_SECRET ---");
console.log(sessionSecret === undefined ? "NOT SET" : `Set, length ${sessionSecret.length}`);

if (testPassword && hash) {
  console.log(`\n--- Testing password "${testPassword}" against stored hash ---`);
  const [salt, storedHashHex] = hash.trim().split(":");
  if (salt && storedHashHex) {
    const candidate = crypto.scryptSync(testPassword, salt, 64);
    const expected = Buffer.from(storedHashHex, "hex");
    const lengthsMatch = candidate.length === expected.length;
    const result = lengthsMatch && crypto.timingSafeEqual(candidate, expected);
    console.log(`Buffer lengths match: ${lengthsMatch} (candidate: ${candidate.length}, expected: ${expected.length})`);
    console.log(`PASSWORD VERIFIES: ${result}`);
  } else {
    console.log("Could not split stored hash into salt:hash — the format is broken.");
  }
}
