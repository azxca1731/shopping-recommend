import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient, HttpLink, split } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";

import { GET_SEARCHED_ARRAY } from "queries";

const cache = new InMemoryCache();
const wsLink = new WebSocketLink({
	uri: `ws://localhost:4000`,
	options: {
		reconnect: true
	}
});

const httpLink = new HttpLink({
	uri: "http://localhost:4000/",
	credentials: "include"
});

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === "OperationDefinition" && operation === "subscription";
	},
	wsLink,
	httpLink
);

const typeDefs = gql`
	extend type Query {
		getSearchedArray: [Message!]!
	}
`;

const Client = new ApolloClient({
	cache,
	link,
	typeDefs,
	resolvers: {
		Query: {
			getSearchedArray: async (_, args, { client }) => {
				try {
					const {
						data: { getSearchedArray }
					} = await client.query({
						query: GET_SEARCHED_ARRAY
					});
					return getSearchedArray;
				} catch (err) {
					return [
						{
							message:
								"현재 접속이 원활하지 않습니다. 다시 시도해주세요",
							me: false,
							id: 1004,
							query: "",
							__typename: "Message"
						},
						{
							message:
								"그래도 안될 경우 쿠키를 제거한 하고 시도해주세요.",
							me: false,
							id: 1005,
							query: "",
							__typename: "Message"
						}
					];
				}
			}
		}
	}
});

export default Client;
