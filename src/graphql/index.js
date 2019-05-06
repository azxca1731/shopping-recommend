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

export const ADD_SEARCHED_ARRAY = gql`
	mutation addSearchedArray($message: String!) {
		addSearchedArray(message: $message) @client {
			message
			me
			id
		}
	}
`;
