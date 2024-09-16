import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
  },
  client: {},
  runtimeEnv: {
    // server
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // client
  },
});
