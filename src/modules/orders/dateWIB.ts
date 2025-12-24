// src/modules/orders/dateWIB.ts

const WIB_OFFSET_MINUTES = 7 * 60;

/**
 * Convert a YYYY-MM-DD (WIB local day) into UTC ISO range:
 * start = 00:00:00.000 WIB, end = 23:59:59.999 WIB
 */
export function wibDayToUtcRange(dateYYYYMMDD: string): { since: string; to: string } {
  // Basic validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateYYYYMMDD)) {
    throw new Error(`Invalid date format: "${dateYYYYMMDD}". Expected YYYY-MM-DD`);
  }

  const [y, m, d] = dateYYYYMMDD.split("-").map(Number);

  // Create "WIB midnight" as an instant in UTC by subtracting the WIB offset.
  // WIB 00:00 == UTC previous day 17:00
  const startUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0) - WIB_OFFSET_MINUTES * 60_000);
  const endUtc = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) - WIB_OFFSET_MINUTES * 60_000);

  return { since: startUtc.toISOString(), to: endUtc.toISOString() };
}
