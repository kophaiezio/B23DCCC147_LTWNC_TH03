import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/data/books';

export default function HomePage() {
  const totalBooks = db.books.length;
  const totalCategories = CATEGORIES.length;

  return (
    <div
      style={{
        padding: '40px 24px',
        maxWidth: '800px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '16px',
        }}
      >
        Thư viện khoa CNTT PTIT
      </h1>
      <p
        style={{
          fontSize: '1.2rem',
          color: '#334155',
          fontWeight: 500,
          marginBottom: '28px',
        }}
      >
        {totalBooks} đầu sách · {totalCategories} chuyên mục
      </p>
      <div>
        <Link
          href="/books"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            fontSize: '1.05rem',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.3)',
          }}
        >
          Xem danh mục sách
        </Link>
      </div>
    </div>
  );
}
