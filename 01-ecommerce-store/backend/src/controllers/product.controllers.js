import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const listAllProducts = async (req, res) => {
	try {
		const allProducts = await Product.find().sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			message: "All products fetched successfully!",
			allProducts,
		});
	} catch (err) {
		console.log(`Error in the listAllProducts controller! ${err.message}`);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const listProduct = async (req, res) => {
	const { productId } = req.params;

	try {
		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid product ID!" });
		}

		if (!productId) {
			return res.status(400).json({
				success: false,
				message: "Please provide product ID!",
			});
		}

		const product = await Product.findById(productId);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Product not found!" });
		}

		res.status(200).json({
			success: true,
			message: "Product fetched successfully!",
			product,
		});
	} catch (err) {
		console.log(`Error in the listProduct controller! ${err.message}`);
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const addProduct = async (req, res) => {
	const { name, description, price, image, stock } = req.body;

	try {
		if (!name || !description || !price || !image) {
			return res
				.status(400)
				.json({ success: false, message: "All fields must be given!" });
		}

		const newProduct = await Product.create({
			name,
			description,
			price,
			image,
			stock,
		});
		if (!newProduct) {
			return res
				.status(400)
				.json({ success: false, message: "Error creating product!" });
		}

		res.status(201).json({
			success: true,
			message: "Product added successfully!",
			newProduct,
		});
	} catch (err) {
		console.log(`Error in the addProduct controller! ${err.message}`);
		res.status(500).json({ message: "Internal server error!" });
	}
};
