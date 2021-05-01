import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { verify } from 'jsonwebtoken';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import User from './entities/User';
import { UserResolver } from './resolvers/User';
import { Context, Payload } from './types';
import { createAccessToken, createRefreshToken } from './utils/createTokens';

async function main() {
	const conn = await createConnection({
		type: 'postgres',
		database: 'jwtauth',
		username: 'postgres',
		password: 'root',
		logging: true,
		synchronize: true,
		migrations: [path.join(__dirname, '/migrations/*')],
		entities: [User],
	});

	await conn.runMigrations();

	const app = express();

	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		})
	);

	app.use(cookieParser());

	app.post('/refresh_token', async (req, res) => {
		const cookie = req.cookies.jid;

		if (!cookie) {
			return res.send({
				ok: false,
				accessToken: '',
			});
		}

		let payload: Payload | null = null;

		try {
			payload = verify(cookie, process.env.REFRESH_TOKEN_SECRET!) as Payload;
		} catch (err) {
			console.log(err);
			return res.send({
				ok: false,
				accessToken: '',
			});
		}

		if (payload) {
			const user = await User.findOne({ where: { id: payload.id } });
			if (!user)
				return res.send({
					ok: false,
					accessToken: '',
				});
			else {
				res.cookie('jid', createRefreshToken(user), {
					httpOnly: true,
				});

				return res.send({
					ok: true,
					accessToken: createAccessToken(user!),
				});
			}
		} else {
			return res.send({
				ok: false,
				accessToken: '',
			});
		}
	});

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
			validate: false,
		}),
		context: ({ req, res }) =>
			({
				req,
				res,
			} as Context),
	});
	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(4000, () => {
		console.log('Server listening on port http://localhost:4000/graphql');
	});
}

main();
