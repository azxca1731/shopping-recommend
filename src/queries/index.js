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

export const ADD_SEARCHED_ARRAY = gql`
	mutation addSearchedArray($message: String!) {
		addSearchedArray(message: $message) @client {
			message
			me
			id
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
