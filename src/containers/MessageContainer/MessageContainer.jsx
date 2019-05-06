import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { READ_SEARCHED_ARRAY } from "../../graphql";
import MessageBox from "../../components/MessageBox";

const MessageContainerDiv = styled.div`
	width: 95%;
	padding: ${props => (props.active ? "2.5%" : "0")};
	height: ${props => (props.active ? "400px" : "0")};
	background-color: ${props => props.theme.backgroundColor};
	margin-bottom: ${props => (props.active ? "10px" : "0")};
	transition: 0.5s all ease-in-out;
	transition-delay: ${props => (props.active ? "0.5s" : "0s")};
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	border-radius: 10px;
	overflow-y: scroll;
`;

const MessageContainer = ({ active, visible }) => {
	return (
		<Query query={READ_SEARCHED_ARRAY}>
			{({ data: { getSearchedArray } }) => (
				<MessageContainerDiv active={active}>
					{active && visible
						? getSearchedArray.map(({ message, me }) => (
								<MessageBox
									key={message}
									message={message}
									me={me}
								/>
						  ))
						: null}
				</MessageContainerDiv>
			)}
		</Query>
	);
};

MessageContainer.propTypes = {
	active: PropTypes.bool.isRequired,
	visible: PropTypes.bool.isRequired
};

export default MessageContainer;
