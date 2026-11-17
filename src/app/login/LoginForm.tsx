'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
      </div>

      {state?.error && (
        <div role="alert" style={{ color: '#d9534f', fontSize: '0.9rem', fontWeight: 500 }}>
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '10px 16px',
          backgroundColor: '#0066cc',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
