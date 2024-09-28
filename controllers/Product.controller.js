import { asyncHandler } from '../utils/AsyncHandler.js';
import ProductModel from '../models/Product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
function containsOnlyDigits(str) {
	return /^\d+$/.test(str);
}
const addProduct = asyncHandler(async (req, res, next) => {
	const { name, price, company } = req.body;
	if ([name, company, price].some((value) => value?.trim() === '')) {
		next(new ApiError(400, 'All Fields Are Required'));
	}
	if (!containsOnlyDigits(price)) {
		next(new ApiError(400, 'Price Should Be Integer'));
	}
	const product = await ProductModel.create({ name, price, company });
	res.status(201).json(new ApiResponse(201, product, 'Product Added'));
});
const getProductById = asyncHandler(async (req, res, next) => {
	const { productId } = req.params;
	const product = await ProductModel.findById(productId);
	if (!product) {
		next(new ApiError(400, 'Price Should Be Integer'));
	}
	res.status(200).json(new ApiResponse(200, product, 'Product Fetched'));
});
const getAllProducts = asyncHandler(async (req, res, next) => {
	const products = await ProductModel.find({});
	if (products.length === 0) {
		return res.status(200).json(new ApiResponse(200, [], 'No Products Added'));
	}
	res.status(200).json(new ApiResponse(200, products, 'All Products'));
});
const deleteProduct = asyncHandler(async (req, res, next) => {
	const { productId } = req.params;
	const deletedProduct = await ProductModel.findByIdAndDelete(productId);
	res
		.status(200)
		.json(new ApiResponse(200, deletedProduct, 'Product Deleted SuccessFully'));
});
const updateProduct = asyncHandler(async (req, res, next) => {
	const { productId } = req.params;
	const updatedProduct = await ProductModel.findByIdAndUpdate(
		productId,
		{
			$set: {
				price: req.body?.price,
				rating: req.body?.rating,
				name: req.body?.name,
				company: req.body?.company,
				featured: req.body?.featured,
			},
		},
		{ new: true },
	);
	res
		.status(200)
		.json(new ApiResponse(200, updatedProduct, 'Product Updated SuccessFully'));
});
const fetchFeatureProducts = asyncHandler(async (req, res, next) => {
	const products = await ProductModel.find({ featured: true });
	if (products.length === 0) {
		return res
			.status(200)
			.json(new ApiResponse(200, [], 'No Featured Products'));
	}
	res.status(200).json(new ApiResponse(200, products, 'Featured Products'));
});
const fetchProductsWithLessPriceThanAValue = asyncHandler(
	async (req, res, next) => {
		const { price } = req.query;
		if (!containsOnlyDigits(price)) {
			next(new ApiError(400, 'Price Should Be Integer'));
		}
		const products = await ProductModel.find({ price: { $lt: price } });
		if (products.length === 0) {
			return res
				.status(200)
				.json(
					new ApiResponse(200, [], `No Products Less Than The Price ${price}`),
				);
		}
		res
			.status(200)
			.json(
				new ApiResponse(200, products, `Products Less Than Price ${price}`),
			);
	},
);
const fetchProductsWithHighRatingThanAValue = asyncHandler(
	async (req, res, next) => {
		const { rating } = req.query;
		if (!containsOnlyDigits(rating)) {
			next(new ApiError(400, 'Rating Should Be Integer'));
		}
		const products = await ProductModel.find({ rating: { $gt: rating } });
		if (products.length === 0) {
			return res
				.status(200)
				.json(
					new ApiResponse(
						200,
						[],
						`No Products Greater Than The Rating ${rating}`,
					),
				);
		}
		res
			.status(200)
			.json(
				new ApiResponse(
					200,
					products,
					`Products Greater Than The Price ${rating}`,
				),
			);
	},
);
export {
	addProduct,
	deleteProduct,
	updateProduct,
	fetchFeatureProducts,
	fetchProductsWithHighRatingThanAValue,
	fetchProductsWithLessPriceThanAValue,
	getAllProducts,
	getProductById,
};
