import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.model.js';
export const verifyJWT = asyncHandler(async (req, res, next) => {
	const accessToken = req.header('Authorization')?.replace('Bearer ', '');
	if (!accessToken) {
		throw new ApiError(500, 'No Access Token');
	}
	const data = jwt.verify(accessToken, process.env.SECRET);
	if (!data) {
		throw new ApiError(500, 'UnAuthorized');
	}
	const user = await UserModel.findById(data.userId).select('-password');
	if (!user) {
		throw new ApiError(500, 'No User');
	}
	req.userId = data.userId;
	next();
});
