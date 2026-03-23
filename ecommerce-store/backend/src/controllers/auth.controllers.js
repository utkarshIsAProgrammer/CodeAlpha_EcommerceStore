import User from "../models/user.model.js";

export const signup = async (req, res) => {
	try {
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
