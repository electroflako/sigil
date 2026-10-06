// SIGIL – forensic string engine
// MD5 implemented locally (RFC 1321), SHA family via Web Crypto.

const K = [
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
  0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
  0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
  0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
  0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
  0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
  0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c8, 0x8f0ccc92,
  0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
  0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
];

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const rotl = (x: number, s: number) => (x << s) | (x >>> (32 - s));

export function md5(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const len = bytes.length;
  const total = Math.ceil((len + 9) / 64) * 64;
  const buf = new Uint8Array(total);
  buf.set(bytes);
  buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(total - 8, (len * 8) >>> 0, true);
  dv.setUint32(total - 4, Math.floor(len / 0x20000000) >>> 0, true);

  let a0 = 0x67452301 | 0;
  let b0 = 0xefcdab89 | 0;
  let c0 = 0x98badcfe | 0;
  let d0 = 0x10325476 | 0;

  for (let off = 0; off < total; off += 64) {
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      const m = dv.getUint32(off + g * 4, true);
      const tmp = d;
      d = c;
      c = b;
      b = (b + rotl(a + f + K[i] + m, S[i])) | 0;
      a = tmp;
    }
    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const out = new Uint8Array(16);
  const odv = new DataView(out.buffer);
  odv.setUint32(0, a0, true);
  odv.setUint32(4, b0, true);
  odv.setUint32(8, c0, true);
  odv.setUint32(12, d0, true);
  return toHex(out);
}

export async function sha(
  name: "SHA-1" | "SHA-256" | "SHA-512",
  input: string,
): Promise<string | null> {
  try {
    if (typeof crypto === "undefined" || !crypto.subtle) return null;
    const buf = await crypto.subtle.digest(
      name,
      new TextEncoder().encode(input),
    );
    return toHex(new Uint8Array(buf));
  } catch {
    return null;
  }
}

export const toHex = (arr: Uint8Array) =>
  [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");

export interface Verdict {
  label: string;
  tone: "acid" | "bone" | "ember";
}

export interface Analysis {
  raw: string;
  length: number;
  isHex: boolean;
  bytes: number[];
  entropy: number;
  unique: number;
  longestRun: number;
  leadingZeros: number;
  payload: string;
  histogram: { ch: string; count: number }[];
  verdicts: Verdict[];
  bitLength: number;
  nullRatio: number;
  noiseScore: number;
}

export function analyze(raw: string): Analysis {
  const s = raw;
  const length = s.length;
  const isHex = length > 0 && /^[0-9a-fA-F]+$/.test(s);
  const bytes =
    isHex && length % 2 === 0
      ? (s.match(/../g) ?? []).map((h) => parseInt(h, 16))
      : [...new TextEncoder().encode(s)];

  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);

  let entropy = 0;
  for (const c of freq.values()) {
    const p = c / length;
    entropy -= p * Math.log2(p);
  }

  let longestRun = 0;
  let run = 0;
  let prev = "";
  for (const ch of s) {
    run = ch === prev ? run + 1 : 1;
    prev = ch;
    if (run > longestRun) longestRun = run;
  }

  const leadingZeros = s.match(/^0+/)?.[0].length ?? 0;
  const payload = s.slice(leadingZeros);
  const alphabet = "0123456789abcdef";
  const histogram = [...alphabet].map((ch) => ({
    ch,
    count: freq.get(ch) ?? 0,
  }));

  const verdicts: Verdict[] = [];
  if (isHex) {
    if (length === 32) verdicts.push({ label: "PERFIL MD5", tone: "acid" });
    if (length === 40) verdicts.push({ label: "PERFIL SHA-1", tone: "acid" });
    if (length === 64) verdicts.push({ label: "PERFIL SHA-256", tone: "acid" });
    if (length === 128) verdicts.push({ label: "PERFIL SHA-512", tone: "acid" });
    if (length % 2 === 0)
      verdicts.push({ label: "REGISTRO DE " + (bytes.length * 8) + " BITS", tone: "bone" });
  } else if (length > 0) {
    verdicts.push({ label: "CARGA UTF-8", tone: "bone" });
  }

  if (leadingZeros >= 8)
    verdicts.push({ label: "CABECERA LLENA DE CEROS", tone: "ember" });
  if (isHex && length === 32 && leadingZeros >= 16)
    verdicts.push({ label: "64 BITS SUPERIORES NULOS", tone: "ember" });

  if (length > 0)
    verdicts.push({
      label: entropy < 3.2 ? "ENTROPÍA BAJA" : "ENTROPÍA ALTA",
      tone: entropy < 3.2 ? "ember" : "acid",
    });

  if (length === 0) verdicts.push({ label: "ESPERANDO SEÑAL", tone: "bone" });

  return {
    raw,
    length,
    isHex,
    bytes,
    entropy: Number.isFinite(entropy) ? entropy : 0,
    unique: freq.size,
    longestRun,
    leadingZeros,
    payload,
    histogram,
    verdicts,
    bitLength: bytes.length * 8,
    nullRatio: length ? leadingZeros / length : 0,
    noiseScore: Math.min(1, entropy / 4),
  };
}
