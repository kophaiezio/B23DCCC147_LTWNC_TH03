import { db } from './db';
import type { Book } from '../types';

export interface BookFilter {
  category?: string;
  q?: string;
}

export async function loadBooksShift(filter?: BookFilter): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let results = db.books;

  if (filter?.category && filter.category.trim() !== '' && filter.category !== 'Tất cả') {
    results = results.filter((b) => b.category === filter.category);
  }

  if (filter?.q && filter.q.trim() !== '') {
    const qLower = filter.q.trim().toLowerCase();
    results = results.filter((b) => b.title.toLowerCase().includes(qLower));
  }

  return results;
}

export async function getBookById(id: number | string): Promise<Book | undefined> {
  const numId = typeof id === 'string' ? Number(id) : id;
  return db.books.find((b) => b.id === numId);
}
