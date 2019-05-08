import gql from "graphql-tag";

export const READ_SEARCHED_ARRAY = gql`
	{
		getSearchedArray @client {
			message
			me
			id
		}
	}
`;

export const GET_SEARCHED_ARRAY = gql`
	query getSearchedArray {
		getSearchedArray {
			message
			me
			id
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
			id
			name
		}
	}
`;
