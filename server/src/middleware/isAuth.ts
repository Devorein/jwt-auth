import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { Context, Payload } from '../types';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
	const authorization = context.req.headers['authorization'];
	if (!authorization) throw new Error('Not authenticated');

	try {
		const token = authorization.split(' ')[1];
		const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as Payload;
		context.payload = payload;
	} catch (err) {
		console.log(err);
		throw new Error('Not authenticated');
	}

	return next();
};
