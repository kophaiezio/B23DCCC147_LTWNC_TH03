import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBookById } from '@/lib/books';

export const revalidate = 60;

export async function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
  }));
}

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return {
      title: 'Không tìm thấy sách',
    };
  }

  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const updateTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        padding: '32px',
        maxWidth: '750px',
        margin: '20px auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <h1 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.8rem' }}>{book.title}</h1>

      <div style={{ lineHeight: '2', fontSize: '1.05rem', color: '#334155' }}>
        <p><strong>Tác giả:</strong> {book.author}</p>
        <p><strong>Chuyên mục:</strong> {book.category}</p>
        <p><strong>Số bản:</strong> {book.copies}</p>
        <p><strong>Cập nhật lúc:</strong> {updateTime}</p>
      </div>

      <div style={{ marginTop: '28px' }}>
        <Link
          href={`/loans?book=${book.id}`}
          style={{
            display: 'inline-block',
            padding: '10px 22px',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)',
          }}
        >
          Mượn sách này
        </Link>
      </div>
    </div>
  );
}
