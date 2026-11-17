import { describe, it, expect } from 'vitest';
import { can } from './permissions';

describe('Kiểm tra ma trận phân quyền can()', () => {
  it('khách chưa đăng nhập chỉ có quyền book:view', () => {
    expect(can(undefined, 'book:view')).toBe(true);
    expect(can(undefined, 'loan:create')).toBe(false);
    expect(can(undefined, 'loan:view-own')).toBe(false);
    expect(can(undefined, 'loan:view-all')).toBe(false);
    expect(can(undefined, 'loan:review')).toBe(false);
  });

  it('student gửi được yêu cầu mượn nhưng không có quyền loan:review', () => {
    expect(can('student', 'book:view')).toBe(true);
    expect(can('student', 'loan:create')).toBe(true);
    expect(can('student', 'loan:view-own')).toBe(true);
    expect(can('student', 'loan:review')).toBe(false);
    expect(can('student', 'loan:view-all')).toBe(false);
  });

  it('admin duyệt được yêu cầu nhưng không có quyền loan:create', () => {
    expect(can('admin', 'book:view')).toBe(true);
    expect(can('admin', 'loan:review')).toBe(true);
    expect(can('admin', 'loan:view-all')).toBe(true);
    expect(can('admin', 'loan:create')).toBe(false);
    expect(can('admin', 'loan:view-own')).toBe(false);
  });
});
