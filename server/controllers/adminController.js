import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

function generateAccessToken(adminId) {
    return jwt.sign({ adminId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(adminId) {
    return jwt.sign({ adminId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

function getRefreshCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

async function createAdmin(req, res) {
    try {
        const { name, email, password } = req.body;

        console.log('Admin registration requested:', email);

        if (!name || !email || !password) {
            console.warn('Admin registration validation failed:', email);
            return res.status(400).json({ message: 'name, email and password are required' });
        }

        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            console.warn('Admin registration blocked: email exists:', email);
            return res.status(409).json({ message: 'Admin with this email already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
        });

        console.log('Admin created:', { adminId: admin._id.toString(), email: admin.email });

        return res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error('Admin registration failed:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.warn('Admin login validation failed:', email);
            return res.status(400).json({ message: 'email and password are required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            console.warn('Admin login failed: admin not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            console.warn('Admin login failed: password mismatch:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(admin._id.toString());
        const refreshToken = generateRefreshToken(admin._id.toString());

        admin.refreshToken = refreshToken;
        await admin.save();
        console.log('Admin login successful:', { adminId: admin._id.toString(), email: admin.email });

        res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error('Admin login failed:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function refreshAdminToken(req, res) {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;
        if (!incomingRefreshToken) {
            console.warn('Refresh token missing');
            return res.status(401).json({ message: 'Refresh token is required' });
        }

        const payload = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const admin = await Admin.findById(payload.adminId);

        if (!admin || admin.refreshToken !== incomingRefreshToken) {
            console.warn('Refresh token rejected');
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(admin._id.toString());
        const newRefreshToken = generateRefreshToken(admin._id.toString());

        admin.refreshToken = newRefreshToken;
        await admin.save();
        console.log('Access token refreshed for admin:', admin._id.toString());

        res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

        return res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.warn('Refresh token failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
}

async function logoutAdmin(req, res) {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (incomingRefreshToken) {
            const admin = await Admin.findOne({ refreshToken: incomingRefreshToken });
            if (admin) {
                admin.refreshToken = '';
                await admin.save();
                console.log('Admin logged out:', admin._id.toString());
            }
        }

        res.clearCookie('refreshToken', getRefreshCookieOptions());
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Admin logout failed:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

async function getCurrentAdmin(req, res) {
    return res.status(200).json({ admin: req.admin });
}

async function getCloudinaryUploadSignature(req, res) {
    try {
        const { folder } = req.body;
        const allowedFolders = ['SandCTours/Cities', 'SandCTours/Tours', 'SandCTours/Reviews'];

        if (!folder || !allowedFolders.includes(folder)) {
            console.warn('Cloudinary signature request rejected: invalid folder', folder);
            return res.status(400).json({ message: 'Invalid upload folder' });
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json({
            timestamp,
            signature,
            folder,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        });
    } catch (error) {
        console.error('Failed to generate Cloudinary upload signature:', error.message);
        return res.status(500).json({ message: error.message });
    }
}

export {
    createAdmin,
    loginAdmin,
    refreshAdminToken,
    logoutAdmin,
    getCurrentAdmin,
    getCloudinaryUploadSignature,
};
