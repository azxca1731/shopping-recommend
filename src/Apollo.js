import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import uuid from "uuid/v1";

import { READ_SEARCHED_ARRAY, GET_SEARCHED_ARRAY } from "queries";

const cache = new InMemoryCache();

const typeDefs = gql`
	extend type Query {
		getSearchedArray: [Message!]!
	}

	extend type Mutation {
		addSearchedArray(message: String!): Message!
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
	link: new HttpLink({
		uri: "http://localhost:4000/",
		credentials: "include"
	}),
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
		},
		Mutation: {
			addSearchedArray: async (_, { message }, { cache, client }) => {
				const query = READ_SEARCHED_ARRAY;
				const { getSearchedArray: previousArray } = cache.readQuery({
					query
				});
				const newMessage = {
					message,
					query: "",
					me: true,
					id: uuid(),
					__typename: "Message"
				};
				const data = {
					getSearchedArray: [...previousArray, newMessage]
				};
				cache.writeQuery({ query, data });
				const newServerMessage = {
					message: "",
					query: message,
					me: false,
					id: uuid(),
					__typename: "Message"
				};
				const newData = {
					getSearchedArray: [
						...data.getSearchedArray,
						newServerMessage
					]
				};
				cache.writeQuery({ query, data: newData });
				return newMessage;
			}
		}
	}
});

export default Client;
