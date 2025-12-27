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
                    const speakeasy = await import('speakeasy');

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

                    // Check 2FA
                    if (user.twoFactorEnabled && user.twoFactorSecret) {
                        const code = (credentials as { email: string; password: string; code?: string }).code;

                        if (!code) {
                            // Password is correct but 2FA code is missing
                            throw new Error('2FA_REQUIRED');
                        }

                        // Verify TOTP code
                        const verified = speakeasy.default.totp.verify({
                            secret: user.twoFactorSecret,
                            encoding: 'base32',
                            token: code,
                        });

                        if (!verified) {
                            // Check if it's a backup code
                            if (user.backupCodes) {
                                const backupCodes = JSON.parse(user.backupCodes) as string[];
                                if (backupCodes.includes(code)) {
                                    // Valid backup code, remove it
                                    const updatedCodes = backupCodes.filter(c => c !== code);
                                    userService.updateBackupCodes(user.id, updatedCodes);
                                } else {
                                    throw new Error('INVALID_2FA_CODE');
                                }
                            } else {
                                throw new Error('INVALID_2FA_CODE');
                            }
                        }
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        accessToken: 'local-token',
                    };
                } catch (error: unknown) {
                    console.error("Auth error:", error);
                    if ((error as Error).message === '2FA_REQUIRED' || (error as Error).message === 'INVALID_2FA_CODE') {
                        throw error;
                    }
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
