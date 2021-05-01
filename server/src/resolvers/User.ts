import argon2 from 'argon2';
import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import User from '../entities/User';
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

@InputType()
export class UserDataInput {
	@Field() username!: string;
	@Field() email!: string;
	@Field() password!: string;
}

@Resolver(User)
export class UserResolver {
	@Query(() => String)
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
}
