import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoanForm } from './LoanForm';
import { generateBooks } from '../data/books';

describe('Kiểm tra component LoanForm theo hành vi người dùng', () => {
  const books = generateBooks(24);

  it('(1) action trả errors thì lỗi hiện ra dưới đúng ô', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {
        bookId: 'Hãy chọn sách',
        pickupDate: 'Hãy chọn ngày',
        term: 'Hãy chọn thời hạn',
        quantity: 'Số quyển phải từ 1 trở lên',
        reason: 'Lý do tối thiểu 10 ký tự',
      },
      values: {},
      ok: false,
    });

    render(<LoanForm books={books} action={mockAction} />);

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Hãy chọn sách')).toBeInTheDocument();
      expect(screen.getByText('Hãy chọn ngày')).toBeInTheDocument();
      expect(screen.getByText('Hãy chọn thời hạn')).toBeInTheDocument();
      expect(screen.getByText('Số quyển phải từ 1 trở lên')).toBeInTheDocument();
      expect(screen.getByText('Lý do tối thiểu 10 ký tự')).toBeInTheDocument();
    });
  });

  it('(2) điền hợp lệ bằng userEvent thì action được gọi 1 lần và FormData có đúng bookId, term, quantity', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {},
      message: 'Đã gửi yêu cầu, chờ duyệt',
      ok: true,
    });

    render(<LoanForm books={books} action={mockAction} />);

    const bookSelect = screen.getByLabelText('Sách');
    const pickupDateInput = screen.getByLabelText('Ngày lấy sách');
    const termSelect = screen.getByLabelText('Thời hạn mượn');
    const quantityInput = screen.getByLabelText('Số quyển');
    const reasonInput = screen.getByLabelText('Lý do mượn');

    await user.selectOptions(bookSelect, '1');
    await user.type(pickupDateInput, '2026-12-25');
    await user.selectOptions(termSelect, '14');
    await user.clear(quantityInput);
    await user.type(quantityInput, '1');
    await user.type(reasonInput, 'Mượn sách phục vụ nghiên cứu khoa học sinh viên');

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    const formData = mockAction.mock.calls[0][1] as FormData;
    expect(formData.get('bookId')).toBe('1');
    expect(formData.get('term')).toBe('14');
    expect(formData.get('quantity')).toBe('1');
  });

  it('(3) action trả message "Sách đã hết bản vào ngày này" cùng values thì thông báo hiện ra và lý do đã nhập vẫn còn', async () => {
    const user = userEvent.setup();
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {
        bookId: '6',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Lý do đặc biệt đã nhập trước đó',
      },
      message: 'Sách đã hết bản vào ngày này',
      ok: false,
    });

    render(<LoanForm books={books} action={mockAction} />);

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Sách đã hết bản vào ngày này')).toBeInTheDocument();
      expect(screen.getByLabelText('Lý do mượn')).toHaveValue('Lý do đặc biệt đã nhập trước đó');
    });
  });

  it('(4) có defaultBookId thì ô Sách được chọn sẵn', () => {
    render(<LoanForm books={books} defaultBookId={6} action={vi.fn()} />);

    const bookSelect = screen.getByLabelText('Sách');
    expect(bookSelect).toHaveValue('6');
  });
});
