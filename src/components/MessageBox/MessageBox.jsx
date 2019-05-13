import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Theme from "Theme";
import ProductList from "containers/ProductList";

const MessageBoxDiv = styled.div`
	position: relative;
	background-color: ${props => props.theme.secondaryColor};
	margin-bottom: 10px;
	padding: 10px;
	border-radius: 5px;
	width: fit-content;
	min-width: 20px;
	max-width: 300px;
	color: ${props => props.theme.LightColor};
	${props =>
		props.me
			? `margin-left: auto; 
				background-color: ${props.theme.primaryColor};
				text-align: right;`
			: `margin-right: auto; 
				background-color: ${props.theme.secondaryColor};
				text-align: left;`}
`;

const DownIcon = styled(FontAwesomeIcon)`
	position: absolute;
	bottom: -14px;
	${props => (props.me === "true" ? "right: 0;" : "left: 0;")}
`;

const MessageBox = ({ message, me, query }) => {
	return (
		<MessageBoxDiv me={me}>
			{message}
			{query ? <ProductList query={query} /> : null}
			<DownIcon
				icon={faCaretDown}
				size={"2x"}
				color={me ? Theme.primaryColor : Theme.secondaryColor}
				me={me.toString()}
			/>
		</MessageBoxDiv>
	);
};

MessageBox.propTypes = {
	message: PropTypes.string.isRequired,
	me: PropTypes.bool.isRequired,
	item: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			name: PropTypes.string
		})
	)
};

export default MessageBox;
