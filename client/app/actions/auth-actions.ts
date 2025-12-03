'use server';

import { userService } from '@/lib/services/user-service';
import { redirect } from 'next/navigation';

export async function registerUserAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'All fields are required' };
    }

    try {
        await userService.createUser(name, email, password);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: 'Failed to create user' };
    }

    redirect('/login?registered=true');
}
