import { sign } from 'jsonwebtoken';
import User from '../entities/User';

export const createAccessToken = (user: User) => {
	return sign({ id: user.id, tokenVersion: user.tokenVersion }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: '15m',
	});
};

export const createRefreshToken = (user: User) => {
	return sign({ id: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {
		expiresIn: '7d',
	});
};
