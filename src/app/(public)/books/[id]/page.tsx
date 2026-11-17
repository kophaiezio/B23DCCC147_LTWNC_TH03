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
    <div style={{ padding: '20px 0' }}>
      <h1>{book.title}</h1>
      <div style={{ marginTop: '16px', lineHeight: '1.8' }}>
        <p><strong>Tác giả:</strong> {book.author}</p>
        <p><strong>Chuyên mục:</strong> {book.category}</p>
        <p><strong>Số bản:</strong> {book.copies}</p>
        <p><strong>Cập nhật lúc:</strong> {updateTime}</p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Link
          href={`/loans?book=${book.id}`}
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          Mượn sách này
        </Link>
      </div>
    </div>
  );
}
