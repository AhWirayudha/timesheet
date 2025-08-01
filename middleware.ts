import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth/session';

const protectedRoutes = '/dashboard';
const demoRoutes = ['/demo', '/demo/timesheet', '/demo/dashboard', '/demo/timesheet/dashboard'];
const loginRoutes = ['/login/sign-in', '/login/sign-up', '/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = pathname.startsWith(protectedRoutes);
  const isDemoRoute = demoRoutes.some(route => pathname.startsWith(route));
  const isLoginRoute = loginRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isRootPath = pathname === '/';

  // Allow demo routes without authentication
  if (isDemoRoute) {
    return NextResponse.next();
  }

  // If user is authenticated and trying to access login pages, redirect to dashboard
  if (isLoginRoute && sessionCookie) {
    try {
      await verifyToken(sessionCookie.value);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Invalid session, continue to login page
    }
  }

  // If user is authenticated and on root path, redirect to timesheet
  if (isRootPath && sessionCookie) {
    try {
      await verifyToken(sessionCookie.value);
      return NextResponse.redirect(new URL('/dashboard/timesheet', request.url));
    } catch (error) {
      // Invalid session, continue to show landing page
    }
  }

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login/sign-in', request.url));
  }

  let res = NextResponse.next();

  if (sessionCookie && request.method === 'GET') {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: 'session',
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString()
        }),
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresInOneDay
      });
    } catch (error) {
      console.error('Error updating session:', error);
      res.cookies.delete('session');
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login/sign-in', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'nodejs'
};
