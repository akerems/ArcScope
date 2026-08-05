import { formatUnits } from "viem";

export function formatTokenAmount(
  value: string | bigint,
  decimals: number,
): string {
  return formatUnits(BigInt(value), decimals);
}

export function formatCompactAmount(value: string): string {
  if (!/^\d+(\.\d+)?$/.test(value)) return "0";
  const [rawInteger, rawFraction = ""] = value.split(".");
  const integer = rawInteger.replace(/^0+(?=\d)/, "") || "0";
  if (integer === "0") {
    const fraction = rawFraction.slice(0, 4).replace(/0+$/, "");
    if (fraction) return `0.${fraction}`;
    return /[1-9]/.test(rawFraction) ? "<0.0001" : "0";
  }
  if (integer.length <= 4) {
    const grouped = new Intl.NumberFormat("en-US").format(BigInt(integer));
    const fraction = rawFraction.slice(0, 2).replace(/0+$/, "");
    return fraction ? `${grouped}.${fraction}` : grouped;
  }
  const suffixes = ["K", "M", "B", "T", "Q"];
  const group = Math.floor((integer.length - 1) / 3);
  if (group > suffixes.length) {
    return `${integer[0]}.${integer.slice(1, 3)}e${integer.length - 1}`;
  }
  const leadingLength = integer.length - group * 3;
  const leading = integer.slice(0, leadingLength);
  const decimals = integer
    .slice(leadingLength, leadingLength + 2)
    .replace(/0+$/, "");
  return `${leading}${decimals ? `.${decimals}` : ""}${suffixes[group - 1]}`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
