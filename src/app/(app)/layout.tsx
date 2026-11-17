import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          padding: '8px 12px',
          background: '#e9ecef',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '0.9rem',
          color: '#495057',
        }}
      >
        Khu vực thành viên
      </div>
      {children}
    </div>
  );
}
