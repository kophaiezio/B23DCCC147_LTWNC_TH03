import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/data/books';

export default function HomePage() {
  const totalBooks = db.books.length;
  const totalCategories = CATEGORIES.length;

  return (
    <div style={{ padding: '24px 0' }}>
      <h1>Thư viện khoa CNTT PTIT</h1>
      <p style={{ margin: '16px 0', fontSize: '1.1rem', color: '#555' }}>
        {totalBooks} đầu sách · {totalCategories} chuyên mục
      </p>
      <div>
        <Link
          href="/books"
          style={{
            display: 'inline-block',
            padding: '10px 18px',
            backgroundColor: '#0066cc',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          Xem danh mục sách
        </Link>
      </div>
    </div>
  );
}
