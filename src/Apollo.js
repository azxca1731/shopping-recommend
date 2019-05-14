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

	extend type Message {
		me: Boolean!
		message: String
		query: String
		id: ID!
	}
`;

const Client = new ApolloClient({
	cache,
	link,
	typeDefs,
	resolvers: {
		Query: {
			getSearchedArray: async (_, args, { client, request }) => {
				const {
					data: { getSearchedArray }
				} = await client.query({
					query: GET_SEARCHED_ARRAY
				});
				return getSearchedArray;
			}
		}
	}
});

export default Client;
