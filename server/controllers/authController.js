const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-for-shop-erp-project-secure';

// Mock Users (In a real app, use DB)
const MOCK_USERS = [
    {
        id: 'admin001',
        email: 'admin@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        name: 'Admin User',
        role: 'admin'
    },
    {
        id: 'staff001',
        email: 'staff@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        name: 'Staff Member',
        role: 'staff'
    }
];

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const userPayload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        success: true,
        message: 'Login successful!',
        token: token,
        user: userPayload
    });
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Mock registration logic
    res.status(201).json({ success: true, message: 'User registered successfully. Please login.' });
};

exports.me = (req, res) => {
    const userProfile = MOCK_USERS.find(u => u.id === req.user.id);
    if (!userProfile) {
        return res.status(404).json({ success: false, message: "User profile not found." });
    }
    const { passwordHash, ...profileToReturn } = userProfile;
    res.status(200).json({ success: true, user: profileToReturn });
};

exports.logout = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
