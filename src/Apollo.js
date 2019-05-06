import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import uuid from "uuid/v1";

import { READ_SEARCHED_ARRAY } from "./graphql";

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
			addSearchedArray: (_, { message }, { cache }) => {
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
				/* TODO1: 서버에 데이터 요청 검색 쿼리 요청후 그 검색 데이터를 캐쉬에 쓰기 issue_6 */
				/* TODO2: newMessage를 예전 대화를 가져올 때 사용하기 위해 서버에 전송 issue_5 */
				cache.writeQuery({ query, data });
				return newMessage;
			}
		}
	}
});

export default Client;
