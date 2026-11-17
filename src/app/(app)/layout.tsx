import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          padding: '6px 14px',
          backgroundColor: '#e0f2fe',
          color: '#0369a1',
          border: '1px solid #bae6fd',
          borderRadius: '20px',
          marginBottom: '20px',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        Khu vực thành viên
      </div>
      {children}
    </div>
  );
}
