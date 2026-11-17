import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { listLoans } from '@/lib/loans';
import { formatDate, TERM_LABEL, STATUS_LABEL } from '@/lib/format';
import { LoanForm } from '@/components/LoanForm';
import { createLoanAction, cancelLoanAction } from './actions';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

interface LoansPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
    book?: string;
  }>;
}

export default async function LoansPage({ searchParams }: LoansPageProps) {
  const session = await auth();
  if (!session?.user?.email || !session.user.role) {
    redirect('/login?callbackUrl=%2Floans');
  }

  const { status, page, book } = await searchParams;
  const defaultBookId = book ? Number(book) : undefined;

  const viewer = {
    email: session.user.email,
    role: session.user.role,
  };

  const { items, total, page: currentPage, totalPages } = listLoans(
    viewer,
    status,
    page
  );

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const statusQuery = status ? `&status=${encodeURIComponent(status)}` : '';

  return (
    <div>
      <h1 style={{ color: '#0f172a', marginBottom: '24px' }}>Sách đã mượn</h1>

      {viewer.role === 'student' && (
        <LoanForm
          books={db.books}
          defaultBookId={defaultBookId}
          action={createLoanAction}
        />
      )}

      {/* (a) Form lọc theo trạng thái */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '16px 20px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <form
          method="GET"
          action="/loans"
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <label htmlFor="status" style={{ fontWeight: 600, color: '#0f172a' }}>
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ''}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #94a3b8',
              backgroundColor: '#ffffff',
              color: '#0f172a',
            }}
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Lọc
          </button>
        </form>
      </div>

      {/* (b) Bảng danh sách yêu cầu mượn */}
      {items.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#64748b' }}>
          Không có yêu cầu mượn nào.
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
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Số lượng</th>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Trạng thái</th>
                {viewer.role === 'student' && (
                  <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Thao tác</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>{item.bookTitle}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{formatDate(item.pickupDate)}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{TERM_LABEL[item.term]}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{item.quantity} quyển</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        backgroundColor:
                          item.status === 'approved'
                            ? '#dcfce7'
                            : item.status === 'rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          item.status === 'approved'
                            ? '#15803d'
                            : item.status === 'rejected'
                            ? '#b91c1c'
                            : '#b45309',
                      }}
                    >
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                  {viewer.role === 'student' && (
                    <td style={{ padding: '12px 16px' }}>
                      {item.status === 'pending' && item.userEmail === viewer.email && (
                        <form action={cancelLoanAction.bind(null, item.id)}>
                          <button
                            type="submit"
                            style={{
                              backgroundColor: '#dc2626',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                            }}
                          >
                            Hủy
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* (c) Phân trang */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '24px',
          fontWeight: 500,
        }}
      >
        {currentPage > 1 ? (
          <Link
            href={`/loans?page=${prevPage}${statusQuery}`}
            style={{ color: '#0284c7', textDecoration: 'underline' }}
          >
            Trước
          </Link>
        ) : (
          <span style={{ color: '#94a3b8' }}>Trước</span>
        )}

        <span style={{ color: '#334155' }}>
          Trang {currentPage}/{totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={`/loans?page=${nextPage}${statusQuery}`}
            style={{ color: '#0284c7', textDecoration: 'underline' }}
          >
            Sau
          </Link>
        ) : (
          <span style={{ color: '#94a3b8' }}>Sau</span>
        )}
      </div>
    </div>
  );
}
