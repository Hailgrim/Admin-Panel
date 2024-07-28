import { MiddlewareConfig, NextMiddleware, NextResponse } from 'next/server';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { ROUTES } from './shared/lib/constants';
import authService from './shared/api/auth/authService';
import { IUser } from './shared/api/users/types';

export const middleware: NextMiddleware = async (request) => {
  // This check allows you to avoid repeated work by the middleware.
  // if (request.headers.has('referer')) return;
  // But it had to be disabled, since server requests on pages in Next.js
  // are not able to change headers, which may contain new pairs of tokens.
  // For this reason, you have to make a request below every time you visit a new page.

  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');
  let updatedCookies: ResponseCookie[] | null | undefined = null;
  let profile: IUser | null = null;
  let response = NextResponse.next();

  if (accessToken || refreshToken) {
    const { data, newCookies } = await authService.getProfile();
    updatedCookies = newCookies;
    profile = data;
  }

  if (profile) {
    if (Object.values(ROUTES.auth).includes(request.nextUrl.pathname)) {
      const searchParams = new URLSearchParams(request.nextUrl.search);

      response = NextResponse.redirect(
        new URL(
          decodeURIComponent(searchParams.get('return') || ROUTES.panel.home),
          request.url
        ),
        { status: 302 }
      );
    }
  } else {
    if (
      !Object.values(ROUTES.auth).includes(request.nextUrl.pathname) &&
      !request.headers.has('referer')
    ) {
      response = NextResponse.redirect(
        new URL(
          `${ROUTES.auth.signIn}?return=${encodeURIComponent(
            request.nextUrl.pathname
          )}`,
          request.url
        ),
        302
      );
    }
  }

  if (updatedCookies) {
    for (const cookie of updatedCookies) {
      response.cookies.set(cookie);
    }
  }

  if (profile) {
    response.headers.set('StoreProfile', JSON.stringify(profile));
  }

  return response;
};

export const config: MiddlewareConfig = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
