import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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
	const mock = [
		{ message: "안녕하세요 쇼핑입니다!", me: false },
		{ message: "궁금하신게 있다면 언제든지 검색을 눌러주세요!", me: false },
		{ message: "와 정말 놀라와요!", me: true },
		{ message: "안녕하세요 쇼핑입니다!", me: false },
		{ message: "궁금하신게 있다면 언제든지 검색을 눌러주세요!", me: false },
		{ message: "와 정말 놀라와요!", me: true },
		{ message: "안녕하세요 쇼핑입니다!", me: false },
		{ message: "궁금하신게 있다면 언제든지 검색을 눌러주세요!", me: false },
		{ message: "와 정말 놀라와요!", me: true },
		{ message: "안녕하세요 쇼핑입니다!", me: false },
		{ message: "궁금하신게 있다면 언제든지 검색을 눌러주세요!", me: false },
		{ message: "와 정말 놀라와요!", me: true },
		{ message: "안녕하세요 쇼핑입니다!", me: false },
		{ message: "궁금하신게 있다면 언제든지 검색을 눌러주세요!", me: false },
		{ message: "와 정말 놀라와요!", me: true }
	];
	const data = mock;
	return (
		<MessageContainerDiv active={active}>
			{active && visible
				? data.map(({ message, me }) => (
						<MessageBox key={message} message={message} me={me} />
				  ))
				: null}
		</MessageContainerDiv>
	);
};

MessageContainer.propTypes = {
	active: PropTypes.bool.isRequired,
	visible: PropTypes.bool.isRequired
};

export default MessageContainer;
