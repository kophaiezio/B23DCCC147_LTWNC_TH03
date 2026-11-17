import { describe, it, expect } from 'vitest';
import { validateLoan, toLoanData, toLoanInput, type LoanInput } from './loan-validate';
import { generateBooks } from '../data/books';

describe('Kiểm tra hàm validateLoan và toLoanData', () => {
  const books = generateBooks(24);

  it('dữ liệu hợp lệ trả về object rỗng', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-12-31',
      term: '14',
      quantity: '1',
      reason: 'Mượn sách để làm bài tập lớn môn Lập trình Web',
    };
    const errors = validateLoan(input, books);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('form trống báo đủ lỗi cho các trường', () => {
    const input: LoanInput = {
      bookId: '',
      pickupDate: '',
      term: '',
      quantity: '',
      reason: '',
    };
    const errors = validateLoan(input, books);
    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.quantity).toBe('Số quyển phải từ 1 trở lên');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('ngày lấy sách trong quá khứ báo lỗi không được ở quá khứ', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2020-01-01',
      term: '7',
      quantity: '1',
      reason: 'Mượn sách phục vụ nghiên cứu khoa học',
    };
    const errors = validateLoan(input, books);
    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('lý do mượn dưới 10 ký tự hoặc toàn khoảng trắng báo lỗi', () => {
    const inputShort: LoanInput = {
      bookId: '1',
      pickupDate: '2099-01-01',
      term: '7',
      quantity: '1',
      reason: '123456789',
    };
    expect(validateLoan(inputShort, books).reason).toBe('Lý do tối thiểu 10 ký tự');

    const inputWhitespace: LoanInput = {
      bookId: '1',
      pickupDate: '2099-01-01',
      term: '7',
      quantity: '1',
      reason: '             ',
    };
    expect(validateLoan(inputWhitespace, books).reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('số quyển vượt số bản của sách báo lỗi', () => {
    const book1 = books.find((b) => b.id === 1);
    expect(book1?.copies).toBe(1);

    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-01-01',
      term: '7',
      quantity: '2',
      reason: 'Mượn sách phục vụ ôn thi kết thúc học phần',
    };
    const errors = validateLoan(input, books);
    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('số quyển không phải số nguyên dương báo lỗi', () => {
    const inputZero: LoanInput = {
      bookId: '1',
      pickupDate: '2099-01-01',
      term: '7',
      quantity: '0',
      reason: 'Mượn sách phục vụ ôn thi kết thúc học phần',
    };
    expect(validateLoan(inputZero, books).quantity).toBe('Số quyển phải từ 1 trở lên');

    const inputNegative: LoanInput = {
      ...inputZero,
      quantity: '-2',
    };
    expect(validateLoan(inputNegative, books).quantity).toBe('Số quyển phải từ 1 trở lên');

    const inputFloat: LoanInput = {
      ...inputZero,
      quantity: '1.5',
    };
    expect(validateLoan(inputFloat, books).quantity).toBe('Số quyển phải từ 1 trở lên');
  });

  it('thời hạn mượn không hợp lệ (10 ngày) báo lỗi', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2099-01-01',
      term: '10',
      quantity: '1',
      reason: 'Mượn sách phục vụ ôn thi kết thúc học phần',
    };
    const errors = validateLoan(input, books);
    expect(errors.term).toBe('Hãy chọn thời hạn');
  });

  it('toLoanData ép kiểu số từ chuỗi và trim lý do', () => {
    const input: LoanInput = {
      bookId: '3',
      pickupDate: '2099-05-10',
      term: '30',
      quantity: '2',
      reason: '   Mượn sách ôn thi kết thúc học phần   ',
    };
    const data = toLoanData(input);
    expect(data.bookId).toBe(3);
    expect(data.pickupDate).toBe('2099-05-10');
    expect(data.term).toBe(30);
    expect(data.quantity).toBe(2);
    expect(data.reason).toBe('Mượn sách ôn thi kết thúc học phần');
  });

  it('toLoanInput chuyển đổi FormData và object thành LoanInput đầy đủ', () => {
    const fd = new FormData();
    fd.append('bookId', '5');
    fd.append('pickupDate', '2026-12-10');
    fd.append('term', '14');
    fd.append('quantity', '2');
    fd.append('reason', 'Mượn sách làm đồ án');

    const inputFromFd = toLoanInput(fd);
    expect(inputFromFd.bookId).toBe('5');
    expect(inputFromFd.pickupDate).toBe('2026-12-10');
    expect(inputFromFd.term).toBe('14');
    expect(inputFromFd.quantity).toBe('2');
    expect(inputFromFd.reason).toBe('Mượn sách làm đồ án');

    const inputFromObj = toLoanInput({
      bookId: '2',
      pickupDate: '2026-12-11',
      term: '7',
      quantity: '1',
      reason: 'Lý do kiểm thử object',
    });
    expect(inputFromObj.bookId).toBe('2');
    expect(inputFromObj.quantity).toBe('1');

    const inputEmpty = toLoanInput(null);
    expect(inputEmpty.bookId).toBe('');
  });
});
