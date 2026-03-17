import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		// get token from
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - No token provided!",
			});
		}

		// verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized - Invalid token!",
			});
		}

		// fetch user from mongoDB (use userId from token payload to find user from mongoDb)
		const currentUser = await User.findById(decoded.userId);
		if (!currentUser) {
			return res.status(401).json({
				success: false,
				message: "User not found!",
			});
		}

		req.user = currentUser;

		next();
	} catch (err) {
		console.log(`Error in teh protectRoute middleware! ${err.message}`);
		res.status(500).json({ message: "Internal server error!" });
	}
};
