import { describe, it, expect } from 'vitest';
import { buildSetBetSchema } from './schema';

describe('buildSetBetSchema', () => {
  it('rejects price <= 0', () => {
    const schema = buildSetBetSchema({});
    expect(schema.safeParse({ price: 0 }).success).toBe(false);
    expect(schema.safeParse({ price: -10 }).success).toBe(false);
  });

  it('accepts a positive price with no constraints', () => {
    const schema = buildSetBetSchema({});
    expect(schema.safeParse({ price: 15000 }).success).toBe(true);
  });

  it('enforces min/max range', () => {
    const schema = buildSetBetSchema({ min: 20000, max: 30000 });
    expect(schema.safeParse({ price: 10000 }).success).toBe(false);
    expect(schema.safeParse({ price: 35000 }).success).toBe(false);
    expect(schema.safeParse({ price: 25000 }).success).toBe(true);
  });

  it('enforces step alignment relative to min', () => {
    const schema = buildSetBetSchema({ min: 20000, max: 30000, step: 500 });
    expect(schema.safeParse({ price: 20300 }).success).toBe(false);
    expect(schema.safeParse({ price: 20500 }).success).toBe(true);
  });
});
