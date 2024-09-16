import { withAuth } from 'next-auth/middleware';

const auth = withAuth({
  pages: { signIn: '/sign-in' },
  callbacks: {
    authorized: (props) => {
      if (props.req.url.includes('16W7.webp')) {
        return true;
      }

      return !!props.token?.id;
    },
  },
});

export const middleware = auth;

export const config = {
  matcher: ['/((?!_next).*)'],
};
