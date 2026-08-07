function parts(value: string): { integer: string; fraction: string } {
  const [rawInteger = "0", rawFraction = ""] = value.split(".");
  return {
    integer: rawInteger.replace(/^0+(?=\d)/, "") || "0",
    fraction: rawFraction.replace(/0+$/, ""),
  };
}

export function compareDecimalStrings(a: string, b: string): number {
  const left = parts(a);
  const right = parts(b);
  if (left.integer.length !== right.integer.length) {
    return left.integer.length > right.integer.length ? 1 : -1;
  }
  if (left.integer !== right.integer) {
    return left.integer > right.integer ? 1 : -1;
  }
  const scale = Math.max(left.fraction.length, right.fraction.length);
  const leftFraction = left.fraction.padEnd(scale, "0");
  const rightFraction = right.fraction.padEnd(scale, "0");
  return leftFraction === rightFraction
    ? 0
    : leftFraction > rightFraction
      ? 1
      : -1;
}

export function addDecimalStrings(values: string[]): string {
  const parsed = values.map(parts);
  const scale = Math.max(0, ...parsed.map((value) => value.fraction.length));
  const total = parsed.reduce(
    (sum, value) =>
      sum +
      BigInt(
        `${value.integer}${value.fraction.padEnd(scale, "0")}` || "0",
      ),
    0n,
  );
  if (scale === 0) return total.toString();
  const padded = total.toString().padStart(scale + 1, "0");
  const integer = padded.slice(0, -scale);
  const fraction = padded.slice(-scale).replace(/0+$/, "");
  return fraction ? `${integer}.${fraction}` : integer;
}
