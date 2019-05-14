import gql from "graphql-tag";

export const READ_SEARCHED_ARRAY = gql`
	{
		getSearchedArray @client {
			message
			me
			id
			query
		}
	}
`;

export const GET_SEARCHED_ARRAY = gql`
	query getSearchedArray {
		getSearchedArray {
			message
			me
			id
			query
		}
	}
`;

export const SEARCH = gql`
	query search($query: String!, $from: Int, $size: Int) {
		search(data: { query: $query, from: $from, size: $size }) {
			total
			productList {
				id
				name
			}
		}
	}
`;

export const SAVE_CHAT = gql`
	mutation saveChat($query: String!) {
		saveChat(query: $query)
	}
`;

export const MESSAGE_SUBSCRIPTION = gql`
	subscription {
		Message {
			id
			me
			message
			query
		}
	}
`;
