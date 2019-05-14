import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import { READ_SEARCHED_ARRAY, MESSAGE_SUBSCRIPTION } from "queries";
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
	constructor(props) {
		super(props);
		this.unsubscribe = null;
	}

	scrollToBottom = () => {
		if (this.messageContainer) {
			this.messageContainer.scrollTo(
				0,
				this.messageContainer.scrollHeight
			);
		}
	};

	componentDidMount() {
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	shouldComponentUpdate(nextProps) {
		if (
			nextProps.active !== this.props.active ||
			nextProps.visible !== this.props.visible
		) {
			return true;
		}
		return false;
	}

	render() {
		const { active, visible } = this.props;
		return (
			<Query query={READ_SEARCHED_ARRAY}>
				{({ data: { getSearchedArray }, subscribeToMore }) => {
					if (!this.unsubscribe) {
						//그냥 setTimeout만 실행시킬시 100ms이내에 두번 코드가 실행 시킬 수 있기 때문에 한번만 하기 위해
						this.unsubscribe = true;
						//web에 qid(cookie)가 새겨지기 전에 실행하는 것을 막기 위해
						setTimeout(() => {
							//렌더링 될 때 마다 subscribeToMore을 실행 시키는 것을 막기 위해
							this.unsubscribe = subscribeToMore({
								document: MESSAGE_SUBSCRIPTION,
								updateQuery: (prev, { subscriptionData }) => {
									if (!subscriptionData.data) return prev;
									const { Message } = subscriptionData.data;
									return {
										...prev,
										getSearchedArray: [
											...prev.getSearchedArray,
											Message
										]
									};
								}
							});
						}, 100);
					}
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
										({ message, me, id, query }) => (
											<MessageBox
												key={id}
												message={message}
												me={me}
												query={query}
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
