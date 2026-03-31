import { createNeonAuth } from '@neondatabase/auth/next/server';
export const auth = createNeonAuth({
  baseUrl: process.env.NEXT_PUBLIC_NEON_AUTH_URL as string,
  cookies: {
    secret: process.env.NEXT_PUBLIC_NEON_AUTH_COOKIE_SECRET as string,
  },
});