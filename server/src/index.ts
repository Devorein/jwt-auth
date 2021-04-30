import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import User from './entities/User';
import { UserResolver } from './resolvers/User';

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

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({
			req,
			res,
		}),
	});
	apolloServer.applyMiddleware({ app, cors: false });
	app.listen(5000, () => {
		console.log('Server listening on port http://localhost:5000/graphql');
	});
}

main();