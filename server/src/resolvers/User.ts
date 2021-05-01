import argon2 from 'argon2';
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import User from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';
import { createAccessToken, createRefreshToken } from '../utils/createTokens';
import { validateRegister } from '../utils/validateRegister';

@ObjectType()
export class FieldError {
	@Field() field: string;
	@Field() message: string;
}

@ObjectType()
export class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
	@Field(() => User, { nullable: true })
	user?: User;
}

@ObjectType()
export class LoginResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];
	@Field(() => String, { nullable: true })
	accessToken?: string;
}

@InputType()
export class UserDataInput {
	@Field() username!: string;
	@Field() email!: string;
	@Field() password!: string;
}

@Resolver(User)
export class UserResolver {
	@Query(() => String)
	@UseMiddleware(isAuth)
	hello() {
		return 'world';
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg('input', () => UserDataInput)
		input: UserDataInput
	): Promise<UserResponse> {
		const errors = validateRegister(input);
		if (errors !== undefined) return { errors };

		const hashedPassword = await argon2.hash(input.password);
		const user = (
			await getConnection()
				.createQueryBuilder()
				.insert()
				.into(User)
				.values({
					password: hashedPassword,
					username: input.username.toLowerCase(),
					email: input.email,
				})
				.returning('*')
				.execute()
		).raw[0];

		try {
			return {
				user,
			};
		} catch (err) {
			if (err.code === '23505') {
				return {
					errors: [
						{
							field: 'username',
							message: 'username already exists',
						},
					],
				};
			} else {
				return {
					errors: [
						{
							field: 'unknown',
							message: 'Unknown error occurred in the backend',
						},
					],
				};
			}
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('usernameOrEmail', () => String) usernameOrEmail: string,
		@Arg('password', () => String) password: string,
		@Ctx() ctx: Context
	): Promise<LoginResponse> {
		const user = await User.findOne({
			where: usernameOrEmail.includes('@')
				? {
						email: usernameOrEmail,
				  }
				: {
						username: usernameOrEmail,
				  },
		});

		if (!user)
			return {
				errors: [
					{
						field: 'usernameOrEmail',
						message: "Couldn't find an user with that username or email",
					},
				],
			};

		const valid = await argon2.verify(user.password, password);
		if (!valid)
			return {
				errors: [
					{
						field: 'password',
						message: "Password don't match",
					},
				],
			};

		ctx.res.cookie('jid', createRefreshToken(user), {
			httpOnly: true,
		});

		return {
			accessToken: createAccessToken(user),
		};
	}
}
