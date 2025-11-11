//lib/auth.js

import crypto from "crypto";

const SCRYPT_KEYLEN = 64;
const SCRYPT_N = 16384; // cost
const SCRYPT_r = 8;
const SCRYPT_p = 1;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, SCRYPT_KEYLEN, { N: SCRYPT_N, r: SCRYPT_r, p: SCRYPT_p }, (err, dk) => {
      if (err) reject(err);
      else resolve(dk);
    });
  });
  // Store as: scrypt$N$r$p$salt$hash (base64)
  return `scrypt$${SCRYPT_N}$${SCRYPT_r}$${SCRYPT_p}$${salt.toString("base64")}$${Buffer.from(derivedKey).toString("base64")}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [scheme, Nstr, rStr, pStr, saltB64, hashB64] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const N = parseInt(Nstr, 10);
    const r = parseInt(rStr, 10);
    const p = parseInt(pStr, 10);
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const derivedKey = await new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, expected.length, { N, r, p }, (err, dk) => {
        if (err) reject(err);
        else resolve(dk);
      });
    });
    return crypto.timingSafeEqual(Buffer.from(derivedKey), expected);
  } catch {
    return false;
  }
}
