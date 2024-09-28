import connectDb from './db/index.js';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import { ApiError } from './utils/ApiError.js';
config();
const app = express();
app.use(
	cors({
		origin: '*',
		credentials: true,
	}),
);
app.use(express.json());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use((err, req, res, next) => {
	if (err instanceof ApiError) {
		return res
			.status(err.statusCode)
			.json({ message: err.message, success: false });
	}
});
const PORT = process.env.PORT || 9092;
connectDb()
	.then(() => {
		app.listen(PORT, () => {
			console.log('Listening on PORT', PORT);
		});
	})
	.catch((error) => console.log('Connection Error', error));
