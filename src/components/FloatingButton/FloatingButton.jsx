import React from "react";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FloatingButtonDiv = styled.div`
	position: absolute;
	bottom: 50px;
	right: 50px;
	border-radius: 50%;
	padding: 15px 17px;
	background-color: ${props => props.theme.primaryColor};
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	&:hover {
		opacity: 0.8;
		transition: opacity 0.3s;
	}
`;

const FloatingButton = () => {
	return (
		<FloatingButtonDiv>
			<FontAwesomeIcon icon={faPlus} />
		</FloatingButtonDiv>
	);
};
export default FloatingButton;
