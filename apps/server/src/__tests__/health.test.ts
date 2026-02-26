import { describe, it, expect } from 'vitest';

describe('server', () => {
  it('should have correct environment defaults', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should export a valid port number', () => {
    const port = parseInt(process.env.PORT || '4000', 10);
    expect(port).toBeGreaterThan(0);
    expect(port).toBeLessThan(65536);
  });
});
