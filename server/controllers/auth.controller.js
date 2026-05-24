const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const buildBaseUsername = (firstName, lastName, email) => {
    const normalize = (value) => (value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '');

    const fromNames = `${normalize(firstName)}${normalize(lastName)}`;
    if (fromNames) {
        return fromNames;
    }

    const emailPrefix = (email || '').split('@')[0];
    return normalize(emailPrefix) || 'user';
};

const generateUniqueUsername = async (firstName, lastName, email) => {
    const baseUsername = buildBaseUsername(firstName, lastName, email);
    let username = baseUsername;
    let suffix = 0;

    while (await User.exists({ username })) {
        suffix += 1;
        username = `${baseUsername}${suffix}`;
    }

    return username;
};

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobileNumber, password, dateOfBirth } = req.body;

        if (!firstName || !lastName || !email || !password || !dateOfBirth) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const parsedDob = new Date(dateOfBirth);
        if (Number.isNaN(parsedDob.getTime())) {
            return res.status(400).json({ message: 'Invalid date of birth' });
        }

        const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
        if (!passwordPolicy.test(password)) {
            return res.status(400).json({
                message: 'Password atleast be 6+ chars with upper, lower, number, special',
            });
        }

        const username = await generateUniqueUsername(firstName, lastName, email);

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            username,
            email,
            mobileNumber: mobileNumber || undefined,
            password: hashedPassword,
            dateOfBirth: parsedDob,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register user error:', error);
        res.status(500).json({
            message: 'Something went wrong while registering user',
            error: error?.message || 'Unknown error',
        });
    }
}



exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ message: 'User not exists.' });
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // set JWT token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                profilePicture: foundUser.profilePicture,
                dateOfBirth: foundUser.dateOfBirth,
                mobileNumber: foundUser.mobileNumber,
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong while logging in user' });
    }
}