import User from "../models/user.model.js";

export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required!" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid email format!" });
		}

		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters!",
			});
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists!" });
		}

		const newUser = await User.create({ name, email, password });
		if (!newUser) {
			return res
				.status(400)
				.json({ success: false, message: "Error creating user!" });
		}

		const token = newUser.signToken();
		res.cookie("jwt", token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: "lax",
			secure: false,
		});

		res.status(201).json({
			success: true,
			message: "User created successfully!",
			newUser,
		});
	} catch (err) {
		console.log(`Error in the signup controller! ${err.message}`);
		res.status(500).json({ message: "Internal serve error!" });
	}
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};
