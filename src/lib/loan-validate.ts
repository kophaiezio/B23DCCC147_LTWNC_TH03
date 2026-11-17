import type { Book, Term } from '@/types';

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
  term: Term;
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
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLoanInput(raw: unknown): LoanInput {
  if (raw instanceof FormData) {
    return {
      bookId: String(raw.get('bookId') ?? ''),
      pickupDate: String(raw.get('pickupDate') ?? ''),
      term: String(raw.get('term') ?? ''),
      quantity: String(raw.get('quantity') ?? ''),
      reason: String(raw.get('reason') ?? ''),
    };
  }

  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>;
    return {
      bookId: String(r.bookId ?? ''),
      pickupDate: String(r.pickupDate ?? ''),
      term: String(r.term ?? ''),
      quantity: String(r.quantity ?? ''),
      reason: String(r.reason ?? ''),
    };
  }

  return {
    bookId: '',
    pickupDate: '',
    term: '',
    quantity: '',
    reason: '',
  };
}

export function validateLoan(input: LoanInput, books: Book[]): LoanErrors {
  const errors: LoanErrors = {};

  // 1. Sách: phải là id của một sách có thật
  const bookIdNum = Number(input.bookId);
  const selectedBook = books.find((b) => b.id === bookIdNum);
  if (!input.bookId || isNaN(bookIdNum) || !selectedBook) {
    errors.bookId = 'Hãy chọn sách';
  }

  // 2. Ngày lấy sách: đúng dạng YYYY-MM-DD, không ở quá khứ (so với hôm nay)
  if (!input.pickupDate || !/^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (input.pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  // 3. Thời hạn mượn: một trong 7, 14, 30
  const termNum = Number(input.term);
  if (!input.term || ![7, 14, 30].includes(termNum as Term)) {
    errors.term = 'Hãy chọn thời hạn';
  }

  // 4. Số quyển: số nguyên >= 1; không vượt số bản của sách đã chọn (kiểm tra chéo 2 trường)
  const qtyNum = Number(input.quantity);
  if (
    !input.quantity ||
    isNaN(qtyNum) ||
    !Number.isInteger(qtyNum) ||
    qtyNum < 1
  ) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (selectedBook && qtyNum > selectedBook.copies) {
    errors.quantity = `Vượt số bản của sách (${selectedBook.copies} bản)`;
  }

  // 5. Lý do mượn: sau khi trim() tối thiểu 10 ký tự
  if (!input.reason || input.reason.trim().length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
}

export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate,
    term: Number(input.term) as Term,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
