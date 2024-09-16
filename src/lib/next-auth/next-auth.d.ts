/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { UserSession } from '@/lib/next-auth/user-session.types';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends UserSession {}
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends UserSession {}
}
