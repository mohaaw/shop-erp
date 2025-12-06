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
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const { userService } = await import('./services/user-service');
                    const user = await userService.getUserByEmailWithPassword(credentials.email);

                    if (!user || !user.password) {
                        return null;
                    }

                    const isValid = await userService.verifyPassword(credentials.password, user.password);

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
