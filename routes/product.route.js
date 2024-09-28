import { Router } from 'express';
import {
	addProduct,
	fetchFeatureProducts,
	getAllProducts,
	fetchProductsWithHighRatingThanAValue,
	fetchProductsWithLessPriceThanAValue,
	deleteProduct,
	updateProduct,
	getProductById,
} from '../controllers/Product.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = Router();
router.route('/addProduct').post(verifyJWT, addProduct);
router.route('/deleteProduct/:productId').delete(verifyJWT, deleteProduct);
router.route('/updateProduct/:productId').put(verifyJWT, updateProduct);
router.route('/getAllProducts').get(verifyJWT, getAllProducts);
router.route('/getProductId/:productId').get(verifyJWT, getProductById);
router.route('/fetchFeatureProducts').get(verifyJWT, fetchFeatureProducts);
router.route('/highRate').get(verifyJWT, fetchProductsWithHighRatingThanAValue);
router.route('/lessPrice').get(verifyJWT, fetchProductsWithLessPriceThanAValue);
export default router;
