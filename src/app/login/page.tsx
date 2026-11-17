import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const { callbackUrl } = await searchParams;

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        padding: '24px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <h1 style={{ marginTop: 0, textAlign: 'center' }}>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl || '/loans'} />
    </div>
  );
}
