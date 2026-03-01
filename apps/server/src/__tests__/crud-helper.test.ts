import { describe, it, expect } from 'vitest';
import type { Request } from 'express';
import { parsePagination, paginatedResponse } from '../routes/admin/masters/crud-helper.js';

function mockReq(query: Record<string, string> = {}): Request {
  return { query } as unknown as Request;
}

describe('parsePagination', () => {
  it('should return defaults when no query params', () => {
    const result = parsePagination(mockReq());
    expect(result).toEqual({ page: 1, limit: 20, skip: 0, search: '' });
  });

  it('should parse page and limit correctly', () => {
    const result = parsePagination(mockReq({ page: '3', limit: '10' }));
    expect(result).toEqual({ page: 3, limit: 10, skip: 20, search: '' });
  });

  it('should clamp page to minimum 1', () => {
    const result = parsePagination(mockReq({ page: '-5' }));
    expect(result.page).toBe(1);
  });

  it('should clamp limit to max 100', () => {
    const result = parsePagination(mockReq({ limit: '500' }));
    expect(result.limit).toBe(100);
  });

  it('should trim search string', () => {
    const result = parsePagination(mockReq({ search: '  hello  ' }));
    expect(result.search).toBe('hello');
  });
});

describe('paginatedResponse', () => {
  it('should format paginated response correctly', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const result = paginatedResponse(items, 50, 2, 10);
    expect(result).toEqual({
      success: true,
      data: {
        items,
        total: 50,
        page: 2,
        limit: 10,
        totalPages: 5,
      },
    });
  });

  it('should calculate totalPages with ceiling division', () => {
    const result = paginatedResponse([], 11, 1, 5);
    expect(result.data.totalPages).toBe(3);
  });
});
