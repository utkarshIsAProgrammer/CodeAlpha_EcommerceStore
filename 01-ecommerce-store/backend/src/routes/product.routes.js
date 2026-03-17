import express from "express";
import {
	listAllProducts,
	listProduct,
	addProduct,
} from "../controllers/product.controllers.js";

const router = express.Router();

router.get("/all-products", listAllProducts);
router.get("/product", listProduct);

router.post("/add-product", addProduct);

export { router as productRoutes };
