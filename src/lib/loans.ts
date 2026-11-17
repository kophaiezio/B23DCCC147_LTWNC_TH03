import { db } from './db';
import { can } from './permissions';
import type { Loan, LoanStatus, Role } from '../types';
import type { LoanData } from './loan-validate';

export interface Viewer {
  email: string;
  role: Role;
}

export interface LoanItemWithTitle extends Loan {
  bookTitle: string;
}

export interface ListLoansResult {
  items: LoanItemWithTitle[];
  total: number;
  page: number;
  totalPages: number;
}

export function parseStatus(v: unknown): LoanStatus | undefined {
  if (v === 'pending' || v === 'approved' || v === 'rejected') {
    return v;
  }
  return undefined;
}

export function listLoans(
  viewer: Viewer,
  status?: string | null,
  page?: number | string
): ListLoansResult {
  let filtered = db.loans;

  if (can(viewer.role, 'loan:view-all')) {
    // Admin sees all
  } else if (can(viewer.role, 'loan:view-own')) {
    // Student sees own
    filtered = filtered.filter((l) => l.userEmail === viewer.email);
  } else {
    // Guest or no permission
    return { items: [], total: 0, page: 1, totalPages: 1 };
  }

  const parsedStatus = parseStatus(status);
  if (parsedStatus) {
    filtered = filtered.filter((l) => l.status === parsedStatus);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  let currentPage = typeof page === 'number' ? page : parseInt(String(page ?? '1'), 10);
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * 10;
  const pageLoans = filtered.slice(startIndex, startIndex + 10);

  const booksMap = new Map(db.books.map((b) => [b.id, b.title]));

  const items: LoanItemWithTitle[] = pageLoans.map((loan) => ({
    ...loan,
    bookTitle: booksMap.get(loan.bookId) ?? `Sách #${loan.bookId}`,
  }));

  return {
    items,
    total,
    page: currentPage,
    totalPages,
  };
}

export function submitLoan(
  email: string,
  data: LoanData
): { ok: true; loan: Loan } | { ok: false; message: string } {
  const book = db.books.find((b) => b.id === data.bookId);
  const totalCopies = book ? book.copies : 0;

  // Tổng quantity của các yêu cầu chưa bị từ chối cùng sách, cùng ngày lấy
  const existingQuantity = db.loans
    .filter(
      (l) =>
        l.bookId === data.bookId &&
        l.pickupDate === data.pickupDate &&
        l.status !== 'rejected'
    )
    .reduce((sum, l) => sum + l.quantity, 0);

  if (existingQuantity + data.quantity > totalCopies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const newLoan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };

  db.loans.unshift(newLoan);

  return { ok: true, loan: newLoan };
}

export function cancelLoan(
  email: string,
  id: number
): 'not-found' | 'forbidden' | 'not-pending' | 'ok' {
  const index = db.loans.findIndex((l) => l.id === id);
  if (index === -1) {
    return 'not-found';
  }

  const loan = db.loans[index];
  if (loan.userEmail !== email) {
    return 'forbidden';
  }

  if (loan.status !== 'pending') {
    return 'not-pending';
  }

  db.loans.splice(index, 1);
  return 'ok';
}
