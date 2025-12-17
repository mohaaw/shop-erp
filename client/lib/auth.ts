import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('Authorize called with:', { email: credentials?.email, hasPassword: !!credentials?.password });
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const { userService } = await import('./services/user-service');
                    console.log('Fetching user...');
                    const user = await userService.getUserByEmailWithPassword(credentials.email);
                    console.log('User fetch result:', user ? { id: user.id, email: user.email, hasHash: !!user.password } : 'not found');

                    if (!user || !user.password) {
                        console.log('User or password missing');
                        return null;
                    }

                    console.log('Verifying password...');
                    const isValid = await userService.verifyPassword(credentials.password, user.password);
                    console.log('Password verification result:', isValid);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        accessToken: 'local-token', // We don't need a real token for local auth anymore, but keeping structure
                    };
                } catch (error: unknown) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                token.role = user.role;
                token.accessToken = user.accessToken;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
