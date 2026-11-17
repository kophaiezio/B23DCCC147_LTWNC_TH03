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
      <h1>Duyệt yêu cầu mượn</h1>
      <p style={{ margin: '16px 0', fontWeight: 'bold' }}>
        Chờ duyệt: {pendingLoans.length} | Đã duyệt: {approvedLoans.length} | Từ chối: {rejectedLoans.length}
      </p>

      {pendingLoans.length === 0 ? (
        <p>Không có yêu cầu nào đang chờ duyệt.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ background: '#eee', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Tên sách</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Ngày lấy</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Thời hạn</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Email người mượn</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.map((loan) => (
              <tr key={loan.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {booksMap.get(loan.bookId) ?? `Sách #${loan.bookId}`}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {formatDate(loan.pickupDate)}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {TERM_LABEL[loan.term]}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {loan.userEmail}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <form action={reviewLoanAction.bind(null, loan.id, 'approved')}>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#28a745',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Duyệt
                      </button>
                    </form>
                    <form action={reviewLoanAction.bind(null, loan.id, 'rejected')}>
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
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
      )}
    </div>
  );
}
