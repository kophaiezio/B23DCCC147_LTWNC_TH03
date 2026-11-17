import { db } from './db';
import { can } from './permissions';
import type { Loan, LoanData, LoanStatus, Role } from '../types';

export interface Viewer {
  email: string;
  role: Role;
}

export interface LoanItem extends Loan {
  bookTitle: string;
}

export interface ListLoansResult {
  items: LoanItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function parseStatus(v?: string): LoanStatus | undefined {
  if (v === 'pending' || v === 'approved' || v === 'rejected') {
    return v;
  }
  return undefined;
}

export function listLoans(viewer: Viewer, status?: string, page: number = 1): ListLoansResult {
  const booksMap = new Map(db.books.map((b) => [b.id, b.title]));

  // Lọc theo người xem
  let filtered = db.loans;
  if (!can(viewer.role, 'loan:view-all')) {
    filtered = filtered.filter((l) => l.userEmail === viewer.email);
  }

  // Lọc theo trạng thái
  const validStatus = parseStatus(status);
  if (validStatus) {
    filtered = filtered.filter((l) => l.status === validStatus);
  }

  const total = filtered.length;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Kẹp page vào khoảng 1 ... totalPages
  let currentPage = page;
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  const items: LoanItem[] = pageItems.map((l) => ({
    ...l,
    bookTitle: booksMap.get(l.bookId) ?? `Sách #${l.bookId}`,
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

  // Tính tổng số lượng của các yêu cầu chưa bị từ chối cùng sách, cùng ngày lấy
  const bookedCopies = db.loans
    .filter(
      (l) =>
        l.bookId === data.bookId &&
        l.pickupDate === data.pickupDate &&
        l.status !== 'rejected'
    )
    .reduce((sum, l) => sum + l.quantity, 0);

  if (bookedCopies + data.quantity > totalCopies) {
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
