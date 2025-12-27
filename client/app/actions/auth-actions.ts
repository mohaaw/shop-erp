'use server';

import { getCurrentUserAction } from './user-actions';
import { userService } from '@/lib/services/user-service';
import speakeasy from 'speakeasy';

export async function generateTwoFactorSecretAction() {
    const user = await getCurrentUserAction();
    if (!user) throw new Error('Unauthorized');

    const secret = speakeasy.generateSecret({
        name: `ShopERP (${user.email})`,
    });

    return {
        secret: secret.base32,
        otpauthUrl: secret.otpauth_url,
    };
}

export async function verifyTwoFactorTokenAction(token: string, secret: string) {
    const user = await getCurrentUserAction();
    if (!user) throw new Error('Unauthorized');

    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
    });

    if (verified) {
        userService.updateTwoFactorSecret(user.id, secret, true);
        return { success: true };
    }

    return { success: false };
}

export async function disableTwoFactorAction() {
    const user = await getCurrentUserAction();
    if (!user) throw new Error('Unauthorized');

    userService.updateTwoFactorSecret(user.id, null, false);
    return { success: true };
}

export async function generateBackupCodesAction() {
    const user = await getCurrentUserAction();
    if (!user) throw new Error('Unauthorized');

    const codes = Array.from({ length: 10 }, () =>
        Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    userService.updateBackupCodes(user.id, codes);
    return codes;
}

export async function registerUserAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        throw new Error('Missing required fields');
    }

    await userService.createUser(name, email, password);
}
