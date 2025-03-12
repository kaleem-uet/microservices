// auth middleware
import jwt from "jsonwebtoken";
import captainModel from "../models/captain.model.js";
import blacklisttokenModel from "../models/blacklisttoken.model.js";

// Middleware to authenticate the user before accessing protected routes
export const authMiddleware = async (req, res, next) => {
try {
    // Get token from cookie
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
      console.log("this is token: " + token);
      
    // Check if token exists
    if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if token is blacklisted
    const isBlacklisted = await blacklisttokenModel.find({ token });
    if (isBlacklisted.length) {
    return res.status(401).json({ message: "Unauthorized" });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if captain exists
    const captain = await captainModel.findById(decoded.id).select("+password");


    if (!captain) {
    return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = captain;
    next();
} catch (error) {
    next(error);
}
};
