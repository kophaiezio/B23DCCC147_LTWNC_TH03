'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="sv01@ptit.edu.vn"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #94a3b8',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#0f172a' }}>
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #94a3b8',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {state?.error && (
        <div role="alert" style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '10px 16px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: '1rem',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
