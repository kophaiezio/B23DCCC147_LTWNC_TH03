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
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#0f172a', fontSize: '1.25rem' }}>
        Gửi yêu cầu mượn sách
      </h3>
      <form key={formKey} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="bookId" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
            Sách
          </label>
          <select
            id="bookId"
            name="bookId"
            defaultValue={currentValues.bookId}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '0.95rem',
            }}
          >
            <option value="">-- Chọn sách --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.copies} bản)
              </option>
            ))}
          </select>
          {state.errors?.bookId && (
            <div role="alert" style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
              {state.errors.bookId}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="pickupDate" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
            Ngày lấy sách
          </label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            defaultValue={currentValues.pickupDate}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
            }}
          />
          {state.errors?.pickupDate && (
            <div role="alert" style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
              {state.errors.pickupDate}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="term" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
            Thời hạn mượn
          </label>
          <select
            id="term"
            name="term"
            defaultValue={currentValues.term}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontSize: '0.95rem',
            }}
          >
            <option value="">-- Chọn thời hạn --</option>
            <option value="7">7 ngày</option>
            <option value="14">14 ngày</option>
            <option value="30">30 ngày</option>
          </select>
          {state.errors?.term && (
            <div role="alert" style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
              {state.errors.term}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="quantity" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
            Số quyển
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            defaultValue={currentValues.quantity}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
            }}
          />
          {state.errors?.quantity && (
            <div role="alert" style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
              {state.errors.quantity}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="reason" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
            Lý do mượn
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            defaultValue={currentValues.reason}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              boxSizing: 'border-box',
              fontSize: '0.95rem',
            }}
          />
          {state.errors?.reason && (
            <div role="alert" style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
              {state.errors.reason}
            </div>
          )}
        </div>

        {state.message && (
          <div
            role={state.ok ? 'status' : 'alert'}
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: state.ok ? '#ecfdf5' : '#fef2f2',
              color: state.ok ? '#065f46' : '#991b1b',
              border: `1px solid ${state.ok ? '#a7f3d0' : '#fecaca'}`,
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            opacity: isPending ? 0.7 : 1,
            alignSelf: 'flex-start',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
    </div>
  );
}

export default LoanForm;
