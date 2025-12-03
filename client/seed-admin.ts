import { userService } from './lib/services/user-service';

async function seedAdmin() {
    try {
        const email = 'admin@example.com';
        const password = 'password123';
        const name = 'Admin User';

        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            console.log('Admin user already exists.');
            return;
        }

        await userService.createUser(name, email, password);
        console.log(`Admin user created: ${email} / ${password}`);
    } catch (error) {
        console.error('Failed to seed admin user:', error);
    }
}

seedAdmin();
