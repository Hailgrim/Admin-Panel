import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { ROUTES } from './lib/constants';
import authService from './services/authService';
import { IUser } from './lib/types';

export const middleware = async (request: NextRequest) => {
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
          searchParams.has('return')
            ? decodeURIComponent(String(searchParams.get('return')))
            : ROUTES.panel.home,
          request.url
        ),
        { status: 302 }
      );
    }
  } else {
    if (!Object.values(ROUTES.auth).includes(request.nextUrl.pathname)) {
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

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
