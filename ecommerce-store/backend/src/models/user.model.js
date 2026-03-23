import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},

		email: {
			type: String,
			required: [true, "Email is required!"],
			unique: true,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			required: [true, "Password is required!"],
			minLength: [6, "Password must be at least 6 characters long!"],
		},

		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},

				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			},
		],

		role: {
			type: String,
			enum: ["admin", "customer"],
			default: "customer",
		},
	},

	{ timestamps: true },
);

// hash password
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	try {
		this.password = await bcrypt.hash(this.password, 10);
		next();
	} catch (err) {
		console.log(`Error hashing password!`);
		next(err.message);
	}
});

// sign token
use.methods.signToken = async function (userId) {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

// compare password
userSchema.methods.comparePassword = function (password) {
	try {
		return bcrypt.compare(password, this.password);
	} catch (err) {
		console.log(`Error comparing password! ${err.message}`);
	}
};

const User = mongoose.model("User", userSchema);
export default User;
