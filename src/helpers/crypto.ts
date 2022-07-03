import sha256 from 'crypto-js/sha256';

export function createHash(text: string): string {
  return sha256(text).toString();
} 