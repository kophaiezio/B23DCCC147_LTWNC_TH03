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
      <h1>Sách đã mượn</h1>

      {viewer.role === 'student' && (
        <LoanForm
          books={db.books}
          defaultBookId={defaultBookId}
          action={createLoanAction}
        />
      )}

      {/* (a) Form lọc theo trạng thái */}
      <form
        method="GET"
        action="/loans"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          margin: '20px 0',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        <label htmlFor="status" style={{ fontWeight: 'bold' }}>
          Trạng thái
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status ?? ''}
          style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
        <button
          type="submit"
          style={{
            padding: '6px 14px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Lọc
        </button>
      </form>

      {/* (b) Bảng danh sách yêu cầu mượn */}
      {items.length === 0 ? (
        <p style={{ marginTop: '16px' }}>Không có yêu cầu mượn nào.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '16px',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#eee', borderBottom: '2px solid #ccc' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên sách</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Ngày lấy</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Thời hạn</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Số lượng</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Trạng thái</th>
              {viewer.role === 'student' && (
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Thao tác</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.bookTitle}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatDate(item.pickupDate)}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{TERM_LABEL[item.term]}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.quantity} quyển</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{STATUS_LABEL[item.status]}</td>
                {viewer.role === 'student' && (
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.status === 'pending' && item.userEmail === viewer.email && (
                      <form action={cancelLoanAction.bind(null, item.id)}>
                        <button
                          type="submit"
                          style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
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
      )}

      {/* (c) Phân trang */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        {currentPage > 1 ? (
          <Link
            href={`/loans?page=${prevPage}${statusQuery}`}
            style={{ color: '#0066cc', textDecoration: 'underline' }}
          >
            Trước
          </Link>
        ) : (
          <span style={{ color: '#888' }}>Trước</span>
        )}

        <span>
          Trang {currentPage}/{totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={`/loans?page=${nextPage}${statusQuery}`}
            style={{ color: '#0066cc', textDecoration: 'underline' }}
          >
            Sau
          </Link>
        ) : (
          <span style={{ color: '#888' }}>Sau</span>
        )}
      </div>
    </div>
  );
}
