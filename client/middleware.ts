import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware";
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'ar'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Always use the locale prefix for routing
    localePrefix: 'always'
});

const authMiddleware = withAuth(
    // Note: If you use withAuth, you need to manually pass the request to intlMiddleware
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
    // Exclude public paths from auth middleware
    const publicPathnameRegex = /^(\/((en|ar)\/)?(login|api|_next|static|.*\\..*))|^\/((en|ar))?$/;

    if (publicPathnameRegex.test(req.nextUrl.pathname)) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as any)(req);
    }
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|_next|.*\\..*).*)', '/', '/(ar|en)/:path*']
};
