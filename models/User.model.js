import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'password is required'],
		},
	},
	{ timestamps: true },
);
const UserModel = mongoose.model('GabloUser', UserSchema);
export default UserModel;
