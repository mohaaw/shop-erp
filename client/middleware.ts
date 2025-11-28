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
    // Regex to exclude API, static files, and Next.js internals
    const excludeRegex = /^\/(api|_next|static|.*\\..*)/;

    if (excludeRegex.test(req.nextUrl.pathname)) {
        return;
    }

    // If it's a public path or already localized, let intlMiddleware handle it
    // The authMiddleware will protect routes that need protection
    const publicPathnameRegex = /^\/((en|ar)\/)?(login)$/;
    const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

    if (isPublicPage) {
        return intlMiddleware(req);
    } else {
        return (authMiddleware as any)(req);
    }
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
