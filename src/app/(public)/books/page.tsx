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
      <h1>Danh mục sách</h1>

      <form
        method="GET"
        action="/books"
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          margin: '20px 0',
          padding: '16px',
          background: '#f4f4f4',
          borderRadius: '6px',
        }}
      >
        <div>
          <label htmlFor="q" style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Tìm sách
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={q ?? ''}
            placeholder="Nhập tên sách..."
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="category" style={{ marginRight: '8px', fontWeight: 'bold' }}>
            Chuyên mục
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category ?? ''}
            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc' }}
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
            padding: '6px 16px',
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

      {books.length === 0 ? (
        <div>
          <p>Render lúc: {renderTime}</p>
          <p>Không tìm thấy sách nào</p>
        </div>
      ) : (
        <div>
          <p>Tìm thấy {books.length} sách</p>
          <p>Render lúc: {renderTime}</p>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '16px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ background: '#eee', borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên sách</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tác giả</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Số bản</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <Link href={`/books/${book.id}`} style={{ color: '#0066cc', textDecoration: 'underline' }}>
                      {book.title}
                    </Link>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{book.author}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>Số bản: {book.copies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
