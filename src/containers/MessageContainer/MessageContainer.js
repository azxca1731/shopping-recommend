import React from "react";
import styled from "styled-components";

const MessageContainerDiv = styled.div`
	width: 100%;
	height: ${props => (props.active ? "400px" : "0")};
	background-color: ${props => props.theme.LightColor};
	margin-bottom: ${props => (props.active ? "10px" : "0")};
	transition: 0.5s all ease-in-out;
	transition-delay: ${props => (props.active ? "0.5s" : "0s")};
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	border-radius: 10px;
`;

const MessageContainer = ({ active }) => {
	return <MessageContainerDiv active={active} />;
};

export default MessageContainer;
