import captainModel from "../models/captain.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const registerCaptain = async (req, res, next) => { 
    try {
        const { name, email, password, isAvailable } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if captain already exists
        const existingCaptain = await captainModel.findOne({ email });
        if (existingCaptain) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Create new captain
        const captain = new captainModel({ name, email, password: hash, isAvailable });
        await captain.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: captain._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set token in cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        // Remove password from response
        const { password: _, ...captainData } = captain._doc;

        // Send response
        res.status(201).json({ token, captain: captainData });
    } catch (error) {
        next(error);
    }
};

export const loginCaptain = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if captain exists
        const captain = await captainModel.findOne({ email }).select("+password");
        if (!captain) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, captain.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: captain._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set token in cookie
        res.cookie("token", token, { httpOnly: true, secure: process.env.JWT_SECRET === "production" });

        // Remove password from response
        const { password: _, ...captainData } = captain._doc;

        // Send response
        res.status(200).json({ token, captain: captainData });
    } catch (error) {
        next(error);
    }
}


export const logoutCaptain = async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

export const checkAvailability = async (req, res, next) => {
    try {
        const captain = req.user;
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.status(200).json({ isAvailable: captain.isAvailable });
    } catch (error) {
        next(error);
    }
}

export const getCaptainProfile = async (req, res, next) => { 
    try {
        const captain = req.user;
        res.status(200).json({ captain });
    } catch (error) {
        next(error);
    }
}

export const updateCaptainProfile = async (req, res, next) => {
    try {
        const captain = req.user;
        const { name, email } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if captain already exists
        const existingCaptain = await captainModel.findOne({ email });
        if (existingCaptain && existingCaptain._id.toString() !== captain._id.toString()) {
            return res.status(400).json({ error: "Email already exists" });
        }

        captain.name = name;
        captain.email = email;
        await captain.save();

        res.status(200).json({ captain });
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => { 
    try {
        const captain = req.user;
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword ||!newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, captain.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid old password" });
        }

        // Hash the new password
        const hash = await bcrypt.hash(newPassword, 10);

        captain.password = hash;
        await captain.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const getCaptainSchedule = async (req, res, next) => {
    try {
        const captain = req.user;
        res.status(200).json({ schedule: captain.schedule });
    } catch (error) {
        next(error);
    }
}

export const updateCaptainSchedule = async (req, res, next) => {
    try {
        const captain = req.user;
        const { schedule } = req.body;

        captain.schedule = schedule;
        await captain.save();

        res.status(200).json({ schedule: captain.schedule });
    } catch (error) {
        next(error);
    }
}   

export const toggleAvailability = async (req, res, next) => {
    try {
        const captain = req.user;
        captain.isAvailable = !captain.isAvailable;
        await captain.save();
        res.status(200).json({ isAvailable: captain.isAvailable });
    } catch (error) {
        next(error);
    }
}

export const getCaptainFeedback = async (req, res, next) => {
    try {
        const captain = req.user;
        res.status(200).json({ feedback: captain.feedback });
    } catch (error) {
        next(error);
    }
}

