import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import uuid from "uuid/v1";

import { READ_SEARCHED_ARRAY, SEARCH } from "./graphql";

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
	link: new HttpLink({ uri: "http://localhost:4000/" }),
	typeDefs,
	resolvers: {
		Query: {
			getSearchedArray: () => [
				/* TODO: 여기에 예전 대화 목록 요청 issue_5
				{
					message: "제발 되라",
					me: true,
					id: uuid(),
					__typename: "Message"
				}*/
			]
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
				/* TODO2: newMessage를 예전 대화를 가져올 때 사용하기 위해 서버에 전송 issue_5 */
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
