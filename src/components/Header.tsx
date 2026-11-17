'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header style={{ borderBottom: '1px solid #ddd', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 'bold' }}>Trang chủ</Link>
        <Link href="/books">Sách</Link>
        {session?.user && (
          <Link href="/loans">Sách đã mượn</Link>
        )}
        {session?.user?.role === 'admin' && (
          <Link href="/admin">Quản trị</Link>
        )}
      </nav>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {session?.user ? (
          <>
            <span>Xin chào, {session.user.name} ({session.user.role})</span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{ cursor: 'pointer', padding: '4px 10px' }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link href="/login">Đăng nhập</Link>
        )}
      </div>
    </header>
  );
}
