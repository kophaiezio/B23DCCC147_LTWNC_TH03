'use client';

import { useActionState } from 'react';
import type { Book } from '@/types';
import type { LoanFormState, LoanInput } from '@/lib/loan-validate';

interface LoanFormProps {
  books: Book[];
  defaultBookId?: number;
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}

const initialState: LoanFormState = {
  errors: {},
  values: {},
};

export function LoanForm({ books, defaultBookId, action }: LoanFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const initialBookId = defaultBookId ? String(defaultBookId) : '';
  const currentValues: Partial<LoanInput> = {
    bookId: state.values?.bookId !== undefined ? state.values.bookId : initialBookId,
    pickupDate: state.values?.pickupDate ?? '',
    term: state.values?.term ?? '',
    quantity: state.values?.quantity ?? (state.ok ? '1' : (state.values?.quantity !== undefined ? state.values.quantity : '1')),
    reason: state.values?.reason ?? '',
  };

  const formKey = `${state.ok ? 'reset' : 'err'}-${currentValues.bookId}-${currentValues.pickupDate}-${currentValues.term}-${currentValues.quantity}-${currentValues.reason}-${state.message ?? ''}`;

  return (
    <div style={{ background: '#fdfdfd', border: '1px solid #ddd', borderRadius: '6px', padding: '20px', marginBottom: '24px' }}>
      <h3 style={{ marginTop: 0 }}>Gửi yêu cầu mượn sách</h3>
      <form key={formKey} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="bookId" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
            Sách
          </label>
          <select
            id="bookId"
            name="bookId"
            defaultValue={currentValues.bookId}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Chọn sách --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.copies} bản)
              </option>
            ))}
          </select>
          {state.errors?.bookId && (
            <div role="alert" style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px' }}>
              {state.errors.bookId}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="pickupDate" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
            Ngày lấy sách
          </label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            defaultValue={currentValues.pickupDate}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {state.errors?.pickupDate && (
            <div role="alert" style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px' }}>
              {state.errors.pickupDate}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="term" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
            Thời hạn mượn
          </label>
          <select
            id="term"
            name="term"
            defaultValue={currentValues.term}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">-- Chọn thời hạn --</option>
            <option value="7">7 ngày</option>
            <option value="14">14 ngày</option>
            <option value="30">30 ngày</option>
          </select>
          {state.errors?.term && (
            <div role="alert" style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px' }}>
              {state.errors.term}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="quantity" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
            Số quyển
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={currentValues.quantity}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {state.errors?.quantity && (
            <div role="alert" style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px' }}>
              {state.errors.quantity}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reason" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
            Lý do mượn
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            defaultValue={currentValues.reason}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          {state.errors?.reason && (
            <div role="alert" style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '4px' }}>
              {state.errors.reason}
            </div>
          )}
        </div>

        {state.message && (
          <div
            role={state.ok ? 'status' : 'alert'}
            style={{
              padding: '10px 14px',
              borderRadius: '4px',
              backgroundColor: state.ok ? '#d4edda' : '#f8d7da',
              color: state.ok ? '#155724' : '#721c24',
              fontSize: '0.95rem',
            }}
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '10px 16px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            opacity: isPending ? 0.7 : 1,
            alignSelf: 'flex-start',
          }}
        >
          {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
    </div>
  );
}

export default LoanForm;
