import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { READ_SEARCHED_ARRAY } from "queries";
import MessageBox from "components/MessageBox";

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

class MessageContainer extends React.Component {
	scrollToBottom = () => {
		if (this.messageContainer) {
			this.messageContainer.scrollTo(
				0,
				this.messageContainer.scrollHeight
			);
		}
	};

	render() {
		const { active, visible } = this.props;
		return (
			<Query query={READ_SEARCHED_ARRAY}>
				{({ data: { getSearchedArray } }) => {
					//렌더링을 시켜주고 scrollToBottom을 호출
					setTimeout(this.scrollToBottom, 0);
					return (
						<MessageContainerDiv
							active={active}
							ref={el => {
								this.messageContainer = el;
							}}
						>
							{active && visible
								? getSearchedArray.map(
										({ message, me, id }) => (
											<MessageBox
												key={id}
												message={message}
												me={me}
											/>
										)
								  )
								: null}
						</MessageContainerDiv>
					);
				}}
			</Query>
		);
	}
}

MessageContainer.propTypes = {
	active: PropTypes.bool.isRequired,
	visible: PropTypes.bool.isRequired
};

export default MessageContainer;
