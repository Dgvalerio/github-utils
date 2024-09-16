import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { UserSession } from '@/lib/next-auth/user-session.types';

const handler = NextAuth({
  providers: [
    Credentials({
      id: 'github-token',
      name: 'github-credentials',
      credentials: {
        id: { label: 'id', type: 'text' },
        email: { label: 'email', type: 'email' },
        photo: { label: 'photo', type: 'text' },
        name: { label: 'name', type: 'text' },
        token: { label: 'token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user: UserSession = {
          id: credentials.id,
          email: credentials.email || 'email@mail.com',
          photo: credentials.photo || 'https://picsum.photos/128/128',
          name: credentials.name || 'Sem Nome',
          token: credentials.token || 'Sem Token',
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt(props) {
      return { ...props.token, ...props.user };
    },
    async session(props) {
      return { ...props.session, ...props.token, ...props.user };
    },
  },
});

export { handler as GET, handler as POST };
