import { RSAA } from 'redux-api-middleware';
import { mockResponse } from '../utils/mockGenerator';
import generalConfig from 'config/general';
import { client } from 'config/graphql';

export const REQUEST_GRAPHQL_QUERY = 'REQUEST_GRAPHQL_QUERY';
export const RECIEVE_GRAPHQL_QUERY = 'RECIEVE_GRAPHQL_QUERY';
export const FAILURE_GRAPHQL_QUERY = 'FAILURE_GRAPHQL_QUERY';
export const graphqlQuery = (
	query = '',
	variables = {},
	isMock = false,
	mockData = { data: {} },
	delay = 5000
) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/graphql`,
		types: [
			REQUEST_GRAPHQL_QUERY,
			RECIEVE_GRAPHQL_QUERY,
			FAILURE_GRAPHQL_QUERY,
		],
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `${query}`,
			variables: `${variables}`,
		}),
		credentials: 'include',
		processMethod: 'every',
		fetch: async (endpoint, options) =>
			isMock
				? await mockResponse(mockData, {}, delay)
				: // NOTE: 這邊只管取資料而已，不會用到 cache 等額外功能，也無法保證與 ApolloPrivider 的 client 是同一個
				  await client
						.query({ query, variables })
						.then(v => v.data)
						.catch(e => e)
						.then(
							res =>
								new Response(JSON.stringify(res), {
									status: 200,
									headers: {
										'Content-Type': 'application/json',
									},
								})
						),
	},
});
