import { describe, it, expect } from 'vitest';
import { formatPeriod } from '@/_pages/project/model/format-period';

describe('formatPeriod', () => {
  it('renders both years when the project has a start and an end', () => {
    expect(formatPeriod({ start: 2025, end: 2026 }, 'Present')).toBe('2025 — 2026');
  });

  it('renders "Present" when the project has no end', () => {
    expect(formatPeriod({ start: 2025 }, 'Present')).toBe('2025 — Present');
  });

  it('renders a single year when start and end are equal', () => {
    expect(formatPeriod({ start: 2025, end: 2025 }, 'Present')).toBe('2025');
  });

  it('uses the provided localized label', () => {
    expect(formatPeriod({ start: 2024 }, 'по настоящее время')).toBe('2024 — по настоящее время');
  });
});
