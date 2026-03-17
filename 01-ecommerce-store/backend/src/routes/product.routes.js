import express from "express";
import {
	listAllProducts,
	listProduct,
	addProduct,
} from "../controllers/product.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/all-products", listAllProducts);
router.get("/product/:productId", listProduct);

router.post("/add-product", protectRoute, addProduct);

export { router as productRoutes };
