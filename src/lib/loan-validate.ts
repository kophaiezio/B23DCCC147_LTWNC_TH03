import type { Book } from '../types';

export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}

export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: 7 | 14 | 30;
  quantity: number;
  reason: string;
}

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export interface LoanFormState {
  errors: LoanErrors;
  values: Partial<LoanInput>;
  message?: string;
  ok?: boolean;
}

export function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function toLoanInput(raw: FormData | Record<string, unknown> | null | undefined): LoanInput {
  if (!raw) {
    return { bookId: '', pickupDate: '', term: '', quantity: '', reason: '' };
  }
  if (typeof FormData !== 'undefined' && raw instanceof FormData) {
    return {
      bookId: String(raw.get('bookId') ?? '').trim(),
      pickupDate: String(raw.get('pickupDate') ?? '').trim(),
      term: String(raw.get('term') ?? '').trim(),
      quantity: String(raw.get('quantity') ?? '').trim(),
      reason: String(raw.get('reason') ?? ''),
    };
  }
  return {
    bookId: String((raw as Record<string, unknown>).bookId ?? '').trim(),
    pickupDate: String((raw as Record<string, unknown>).pickupDate ?? '').trim(),
    term: String((raw as Record<string, unknown>).term ?? '').trim(),
    quantity: String((raw as Record<string, unknown>).quantity ?? '').trim(),
    reason: String((raw as Record<string, unknown>).reason ?? ''),
  };
}

export function validateLoan(input: LoanInput, books: Book[]): LoanErrors {
  const errors: LoanErrors = {};

  // 1. Sách
  const bookIdNum = Number(input.bookId);
  const selectedBook = input.bookId ? books.find((b) => b.id === bookIdNum) : undefined;
  if (!input.bookId || !selectedBook) {
    errors.bookId = 'Hãy chọn sách';
  }

  // 2. Ngày lấy sách
  if (!input.pickupDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (input.pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  // 3. Thời hạn mượn
  const termNum = Number(input.term);
  if (!input.term || ![7, 14, 30].includes(termNum)) {
    errors.term = 'Hãy chọn thời hạn';
  }

  // 4. Số quyển
  const qtyNum = Number(input.quantity);
  if (!input.quantity || !Number.isInteger(qtyNum) || qtyNum < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (selectedBook && qtyNum > selectedBook.copies) {
    errors.quantity = `Vượt số bản của sách (${selectedBook.copies} bản)`;
  }

  // 5. Lý do mượn
  if (!input.reason || input.reason.trim().length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
}

export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate,
    term: Number(input.term) as 7 | 14 | 30,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
