import User from "../models/user.model.js";

export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required!" });
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return res
				.status(400)
				.json({ success: false, message: "User already exists!" });
		}

		const user = await User.create({ name, email, password });

		const { accessToken, refreshToken } = signToken(user._id);
	} catch (err) {
		console.log(`Error in the signup controller! ${err.message}`);
		res.status(500).json({
			success: false,
			message: "Internal Server Error!",
		});
	}
};

export const login = async (req, res) => {};

export const logout = async (req, res) => {};
