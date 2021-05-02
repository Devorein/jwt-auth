import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';

const httpLink = createHttpLink({
	uri: 'http://localhost:4000/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors)
		graphQLErrors.map(({ message, locations, path }) =>
			console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
		);
	if (networkError) console.log(`[Network error]: ${networkError}`);
});

const requestLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem('token');
	if (token) {
		operation.setContext({
			headers: {
				authorization: `bearer ${token}`,
			},
		});
	}
	return forward(operation);
});

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		const token = localStorage.getItem('token');
		if (!token) {
			return true;
		}

		try {
			const { exp } = jwtDecode(token) as any;
			if (Date.now() >= exp * 1000) {
				return false;
			} else {
				return true;
			}
		} catch {
			return false;
		}
	},
	fetchAccessToken: () => {
		return fetch('http://localhost:4000/refresh_token', {
			method: 'POST',
			credentials: 'include',
		});
	},
	handleFetch: (accessToken) => {
		localStorage.setItem('token', accessToken);
	},
	handleError: (err) => {
		console.warn('Your refresh token is invalid. Try to login again');
		console.error(err);
	},
});

export const createApolloClient = () => {
	return new ApolloClient({
		credentials: 'include',
		uri: 'http://localhost:4000/graphql',
		cache: new InMemoryCache(),
		link: ApolloLink.from([tokenRefreshLink, errorLink, requestLink, httpLink]),
	});
};
