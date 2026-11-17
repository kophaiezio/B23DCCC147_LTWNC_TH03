import { describe, it, expect, beforeEach } from 'vitest';
import { listLoans, submitLoan, cancelLoan } from './loans';
import { db } from './db';
import { generateBooks, generateLoans } from '../data/books';

describe('Kiểm tra nghiệp vụ loans trong src/lib/loans.ts', () => {
  beforeEach(() => {
    db.books = generateBooks(24);
    db.loans = generateLoans(37);
    db.nextLoanId = 38;
  });

  it('listLoans: sv01 có 27 yêu cầu chia 3 trang (10/10/7), admin thấy 37, trang vượt giới hạn bị kẹp lại', () => {
    const sv01Viewer = { email: 'sv01@ptit.edu.vn', role: 'student' as const };
    const adminViewer = { email: 'admin@ptit.edu.vn', role: 'admin' as const };

    const res1 = listLoans(sv01Viewer, null, 1);
    expect(res1.total).toBe(27);
    expect(res1.totalPages).toBe(3);
    expect(res1.items).toHaveLength(10);
    expect(res1.page).toBe(1);

    const res2 = listLoans(sv01Viewer, null, 2);
    expect(res2.items).toHaveLength(10);
    expect(res2.page).toBe(2);

    const res3 = listLoans(sv01Viewer, null, 3);
    expect(res3.items).toHaveLength(7);
    expect(res3.page).toBe(3);

    const adminRes = listLoans(adminViewer, null, 1);
    expect(adminRes.total).toBe(37);
    expect(adminRes.totalPages).toBe(4);

    const clampedRes = listLoans(sv01Viewer, null, 99);
    expect(clampedRes.page).toBe(3);
    expect(clampedRes.items).toHaveLength(7);

    const clampedNegative = listLoans(sv01Viewer, null, -5);
    expect(clampedNegative.page).toBe(1);
  });

  it('submitLoan: trả hết bản với sách id 6 ngày 2026-12-02', () => {
    const res = submitLoan('sv01@ptit.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách phục vụ nghiên cứu an toàn mạng',
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.message).toBe('Sách đã hết bản vào ngày này');
    }
  });

  it('cancelLoan: tạo được rồi cancelLoan trả đúng 3 mã (forbidden, ok, not-found)', () => {
    const submitRes = submitLoan('sv01@ptit.edu.vn', {
      bookId: 11,
      pickupDate: '2026-12-03',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách ôn thi kết thúc học phần cơ sở dữ liệu',
    });
    expect(submitRes.ok).toBe(true);

    if (submitRes.ok) {
      const createdLoanId = submitRes.loan.id;

      const resForbidden = cancelLoan('sv02@ptit.edu.vn', createdLoanId);
      expect(resForbidden).toBe('forbidden');

      const resOk = cancelLoan('sv01@ptit.edu.vn', createdLoanId);
      expect(resOk).toBe('ok');

      const resNotFound = cancelLoan('sv01@ptit.edu.vn', createdLoanId);
      expect(resNotFound).toBe('not-found');

      expect(cancelLoan('sv01@ptit.edu.vn', 999999)).toBe('not-found');
    }
  });
});
