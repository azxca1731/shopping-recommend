import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import uuid from "uuid/v1";

import { READ_SEARCHED_ARRAY, SEARCH, GET_SEARCHED_ARRAY } from "queries";

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
		message: String!
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
					me: true,
					id: uuid(),
					__typename: "Message"
				};
				const data = {
					getSearchedArray: [...previousArray, newMessage]
				};
				cache.writeQuery({ query, data });
				const {
					data: { search }
				} = await client.query({
					query: SEARCH,
					variables: {
						query: message,
						from: 0,
						size: 5
					}
				});
				const newServerMessage = {
					message:
						search.length > 0
							? search.reduce(
									(acc, { name }, index) =>
										`${acc} ${index + 1}:${name}`,
									""
							  )
							: "검색된 상품이 없습니다. 다시 확인해주세요",
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
