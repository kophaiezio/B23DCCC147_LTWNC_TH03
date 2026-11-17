import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('Kiểm tra hàm format trong src/lib/format.ts', () => {
  it('formatDate chuyển đổi đúng định dạng YYYY-MM-DD sang dd/mm/yyyy', () => {
    expect(formatDate('2026-12-02')).toBe('02/12/2026');
  });
});
