import Link from 'next/link';
import { loadBooksShift } from '@/lib/books';
import { CATEGORIES } from '@/data/books';

interface BooksPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { category, q } = await searchParams;
  const books = await loadBooksShift({ category, q });

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const renderTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div>
      <h1 style={{ color: '#0f172a', marginBottom: '20px' }}>Danh mục sách</h1>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <form
          method="GET"
          action="/books"
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <label htmlFor="q" style={{ marginRight: '8px', fontWeight: 600, color: '#0f172a' }}>
              Tìm sách
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={q ?? ''}
              placeholder="Nhập tên sách..."
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #94a3b8',
                backgroundColor: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          <div>
            <label htmlFor="category" style={{ marginRight: '8px', fontWeight: 600, color: '#0f172a' }}>
              Chuyên mục
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category ?? ''}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #94a3b8',
                backgroundColor: '#ffffff',
                color: '#0f172a',
              }}
            >
              <option value="">Tất cả</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 20px',
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

      {books.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <p style={{ color: '#64748b', marginBottom: '8px' }}>Render lúc: {renderTime}</p>
          <p style={{ color: '#ef4444', fontWeight: 600 }}>Không tìm thấy sách nào</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Tìm thấy {books.length} sách</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Render lúc: {renderTime}</span>
          </div>

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
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Tác giả</th>
                <th style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>Số bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <Link
                      href={`/books/${book.id}`}
                      style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'none' }}
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{book.author}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>Số bản: {book.copies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
