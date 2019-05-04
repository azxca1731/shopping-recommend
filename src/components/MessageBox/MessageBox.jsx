import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Theme from "../../Theme";

const MessageBoxDiv = styled.div`
	position: relative;
	background-color: ${props => props.theme.secondaryColor};
	margin-bottom: 10px;
	padding: 5px;
	border-radius: 5px;
	width: fit-content;
	color: ${props => props.theme.LightColor};
	${({ me, theme }) =>
		me
			? `margin-left: auto; background-color: ${theme.primaryColor}`
			: `margin-right: auto; background-color: ${theme.secondaryColor}`}
`;

const DownIcon = styled(FontAwesomeIcon)`
	position: absolute;
	bottom: -14px;
	${({ me }) => (me ? "right: 0;" : "left: 0;")}
`;

const MessageBox = ({ message, me }) => {
	return (
		<MessageBoxDiv me={me}>
			{message}
			<DownIcon
				icon={faCaretDown}
				size={"2x"}
				color={me ? Theme.primaryColor : Theme.secondaryColor}
				me={me}
			/>
		</MessageBoxDiv>
	);
};

MessageBox.propTypes = {
	message: PropTypes.string.isRequired,
	me: PropTypes.bool.isRequired
};

export default MessageBox;
