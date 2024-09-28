import UserModel from '../models/User.model.js';
import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
const generateAccessToken = (payload) => {
	return jwt.sign(payload, process.env.SECRET, {
		expiresIn: '5d',
	});
};
const registerUser = asyncHandler(async (req, res, next) => {
	const { username, password, email } = req.body;
	if ([username, password, email].some((value) => value?.trim() === '')) {
		next(new ApiError(400, 'All Fields Are Required'));
	}
	const existedUser = await UserModel.findOne({
		$or: [{ email }, { username }],
	});
	if (existedUser) {
		next(new ApiError(400, 'User Already Exists'));
	}
	const user = await UserModel.create({
		username: username.toLowerCase(),
		password: await bcrypt.hash(password, 10),
		email,
	});
	const createdUser = await UserModel.findById(user._id).select('-password');
	if (!createdUser) {
		next(new ApiError(400, 'User Not Created In Database'));
	}
	const payload = {
		userId: createdUser._id,
		email: createdUser.email,
	};
	const token = generateAccessToken(payload);
	res
		.status(201)
		.json(
			new ApiResponse(201, { token, createdUser }, 'User Created SuccessFully'),
		);
});
const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	if ([email, password].some((value) => value?.trim() === '')) {
		next(new ApiError(400, 'All Fields Are Required'));
	}
	const user = await UserModel.findOne({ email });
	if (!user) {
		next(new ApiError(400, 'User With This Email Is NotFound'));
	}
	const passwordCheck = await bcrypt.compare(password, user.password);
	console.log(passwordCheck);

	if (!passwordCheck) {
		next(new ApiError(400, 'Password Is Incorrect'));
		return;
	}
	const payload = {
		userId: user._id,
		email: user.email,
	};
	user.password = undefined;
	const token = generateAccessToken(payload);
	res.status(200).json(new ApiResponse(200, { user, token }, 'LoggedIn'));
});
export { loginUser, registerUser };
