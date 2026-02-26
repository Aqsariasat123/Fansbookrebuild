import { describe, it, expect } from 'vitest';
import { formatCurrency, slugify, truncate, calculatePlatformFee, formatFileSize } from '../utils';

describe('shared/utils', () => {
  describe('formatCurrency', () => {
    it('formats USD amounts correctly', () => {
      expect(formatCurrency(9.99)).toBe('$9.99');
      expect(formatCurrency(100)).toBe('$100.00');
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('  Spaces  Everywhere  ')).toBe('spaces-everywhere');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('short', 10)).toBe('short');
      expect(truncate('this is a long text', 10)).toBe('this is...');
    });
  });

  describe('calculatePlatformFee', () => {
    it('calculates 20% fee', () => {
      expect(calculatePlatformFee(100)).toBe(20);
      expect(calculatePlatformFee(49.99)).toBe(10);
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1048576)).toBe('1.0 MB');
    });
  });
});
