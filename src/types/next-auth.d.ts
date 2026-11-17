import type { Role } from '@/types';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      role: Role;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
  }
}

declare module '@auth/core/types' {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      role: Role;
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: Role;
  }
}
