import User from "../models/user.model.js";
import { redis } from "../db/redis.js";
import jwt from "jsonwebtoken";

// function to store refresh token in redis
const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refreshToken:${userId}`, refreshToken, {
		ex: 7 * 24 * 60 * 60,
	});
};

// function to set cookies
const setCookies = async (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000,
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

// signup controller
export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required!" });
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long!",
			});
		}

		const emailRegex =
			/^(?!.*\.\.)(?!.*\.$)[^\W][A-Za-z0-9._%+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email format!" });
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists!" });
		}

		const user = await User.create({ name, email, password });

		const { accessToken, refreshToken } = await user.signToken(user._id);
		await storeRefreshToken(user._id, refreshToken); // store refresh token in redis
		setCookies(res, accessToken, refreshToken); // set cookies

		res.status(201).json({
			success: true,
			message: "User created successfully!",
			user: {
				userId: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		console.log(`Error in the signup controller! ${err.message}`);
		res.status(500).json({
			success: false,
			message: "Internal server error!",
		});
	}
};

// login controller
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required!" });
		}
	} catch (err) {
		console.log(`Error in the login controller! ${err.message}`);
		res.status(500).json({
			success: false,
			message: "Internal server error!",
		});
	}
};

// logout controller
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken; // get refresh token from the server request

		// delete refresh token from redis
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
			await redis.del(`refreshToken:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		res.status(200).json({
			success: true,
			message: "Logged out successfully!",
		});
	} catch (err) {
		console.log(`Error in the logout controller! ${err.message}`);
		res.status(500).json({
			success: false,
			message: "Internal server error!",
		});
	}
};
