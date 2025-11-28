import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            authorized: ({ token }) => token != null,
        },
        pages: {
            signIn: '/login',
        },
    }
);

export default function middleware(req: NextRequest) {
    const publicPathnameRegex = /^(\/((en|ar)\/)?(login|api|_next|static|.*\\..*))|^\/((en|ar))?$/;

    if (publicPathnameRegex.test(req.nextUrl.pathname)) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as any)(req);
    }
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)', '/', '/(ar|en)/:path*']
};
