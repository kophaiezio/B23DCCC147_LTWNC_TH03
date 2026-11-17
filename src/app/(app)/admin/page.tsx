import type { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoanAction } from './actions';

export const metadata: Metadata = {
  title: 'Duyệt yêu cầu mượn',
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pendingLoans = db.loans.filter((l) => l.status === 'pending');
  const approvedLoans = db.loans.filter((l) => l.status === 'approved');
  const rejectedLoans = db.loans.filter((l) => l.status === 'rejected');

  const booksMap = new Map(db.books.map((b) => [b.id, b.title]));

  return (
    <div>
      <h1 style={{ color: '#0f172a', marginBottom: '16px' }}>Duyệt yêu cầu mượn</h1>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          marginBottom: '20px',
          fontWeight: 600,
          color: '#334155',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <span style={{ color: '#b45309' }}>Chờ duyệt: {pendingLoans.length}</span>
        {' | '}
        <span style={{ color: '#15803d' }}>Đã duyệt: {approvedLoans.length}</span>
        {' | '}
        <span style={{ color: '#b91c1c' }}>Từ chối: {rejectedLoans.length}</span>
      </div>

      {pendingLoans.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b' }}>
          Không có yêu cầu nào đang chờ duyệt.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Tên sách</th>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Ngày lấy</th>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Thời hạn</th>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Email người mượn</th>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pendingLoans.map((loan) => (
                <tr key={loan.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>
                    {booksMap.get(loan.bookId) ?? `Sách #${loan.bookId}`}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {formatDate(loan.pickupDate)}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {TERM_LABEL[loan.term]}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {loan.userEmail}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <form action={reviewLoanAction.bind(null, loan.id, 'approved')}>
                        <button
                          type="submit"
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
                          Duyệt
                        </button>
                      </form>
                      <form action={reviewLoanAction.bind(null, loan.id, 'rejected')}>
                        <button
                          type="submit"
                          style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
                          Từ chối
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
