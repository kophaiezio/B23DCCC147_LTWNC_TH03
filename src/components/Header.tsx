'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, update } = useSession();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      void update();
    }
  }, [pathname, update]);

  return (
    <header
      style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        borderBottom: '1px solid #334155',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: '1.05rem',
            color: '#38bdf8',
          }}
        >
          Trang chủ
        </Link>
        <Link
          href="/books"
          style={{
            color: '#f1f5f9',
            fontWeight: 500,
          }}
        >
          Sách
        </Link>
        {session?.user && (
          <Link
            href="/loans"
            style={{
              color: '#f1f5f9',
              fontWeight: 500,
            }}
          >
            Sách đã mượn
          </Link>
        )}
        {session?.user?.role === 'admin' && (
          <Link
            href="/admin"
            style={{
              color: '#fbbf24',
              fontWeight: 600,
            }}
          >
            Quản trị
          </Link>
        )}
      </nav>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {session?.user ? (
          <>
            <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
              Xin chào, <strong>{session.user.name}</strong> ({session.user.role})
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{
                cursor: 'pointer',
                padding: '6px 14px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{
              padding: '6px 14px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
