import { isIP } from "net";

/** Never trust a hop count or a caller-controlled header by default. Restrict
 * ingress separately; allow only proxy IPs/CIDRs whose rewriting was verified. */
export function trustedProxies(value = process.env.TRUSTED_PROXY_CIDRS || ""): false | string[] {
  const entries = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!entries.length) return false;
  for (const entry of entries) {
    const [address, bits, extra] = entry.split("/");
    const family = isIP(address);
    if (
      !family ||
      extra !== undefined ||
      (bits !== undefined &&
        (!/^\d+$/.test(bits) || Number(bits) < 1 || Number(bits) > (family === 4 ? 32 : 128)))
    ) {
      throw new Error("TRUSTED_PROXY_CIDRS must contain explicit proxy IPs or non-wildcard CIDRs");
    }
  }
  return entries;
}
