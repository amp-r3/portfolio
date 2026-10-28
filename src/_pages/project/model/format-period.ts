import type { ProjectPeriod } from '@/entities/project';

/**
 * Formats a project period for the metadata row.
 * - `2025 — 2026` when both years are known and differ
 * - `2025 — Present` when the project is still ongoing
 * - `2025` when the project started and finished in the same year
 */
export function formatPeriod(period: ProjectPeriod, presentLabel: string): string {
  const { start, end } = period;

  if (end === undefined) {
    return `${start} — ${presentLabel}`;
  }

  if (end === start) {
    return String(start);
  }

  return `${start} — ${end}`;
}
