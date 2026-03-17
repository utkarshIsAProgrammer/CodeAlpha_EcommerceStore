import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
		},

		password: {
			type: String,
			required: true,
			min: 6,
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) {
		return;
	}

	this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.signToken = function () {
	return jwt.sign({ userId: this.id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};

const User = mongoose.model("User", userSchema);
export default User;
