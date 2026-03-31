import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/login',
});

export const config = {
  matcher: [
    /*
     Match all routes EXCEPT:
     - /login
     - /signup
     - /api (optional but recommended)
     - static files (_next, images, etc.)
    */
    '/((?!login|signup|api|_next|.*\\..*).*)',
  ],
};