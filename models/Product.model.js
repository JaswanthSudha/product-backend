import mongoose, { Schema } from 'mongoose';
const ProductSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Product Name is Mandatory'],
	},
	price: {
		type: Number,
		required: [true, 'Please Enter Price'],
	},
	featured: {
		type: Boolean,
		default: false,
	},
	rating: {
		type: Number,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	company: {
		type: String,
		required: true,
	},
});
const ProductModel = mongoose.model('GabiloProduct', ProductSchema);
export default ProductModel;
