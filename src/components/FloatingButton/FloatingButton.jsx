import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MessageContainer from "../../containers/MessageContainer";
import InputBar from "../InputBar";

const ButtonHover = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
`;

const FloatingButtonDiv = styled.div`
	position: absolute;
	bottom: 50px;
	right: 50px;
	border-radius: 10px;
	padding: 15px 17px;
	background-color: ${props => props.theme.primaryColor};
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	&:hover {
		animation: ${ButtonHover} 1s;
	}
`;

const PlusIcon = styled(FontAwesomeIcon)`
	transform: ${props => (props.active ? "rotate(45deg)" : "")};
	transition: transform 0.5s;
`;

const SearchIcon = styled(FontAwesomeIcon)`
	position: absolute;
	bottom: 18px;
	left: 20px;
	display: ${props => (props.active ? "block" : "none")};
`;

const FloatingButton = () => {
	const [active, setActive] = useState(false);
	const [messageVisible, setVisible] = useState(false);
	let timeOut;
	return (
		<FloatingButtonDiv active={active}>
			<MessageContainer active={active} visible={messageVisible} />
			<InputBar active={active} />
			<PlusIcon
				icon={faPlus}
				active={active}
				onClick={() => {
					if (!active) {
						clearTimeout(timeOut);
						setActive(!active);
						timeOut = setTimeout(() => {
							setVisible(true);
						}, 1050);
					} else {
						setActive(!active);
						setVisible(false);
					}
				}}
			/>
			<SearchIcon icon={faSearch} active={active} />
		</FloatingButtonDiv>
	);
};

export default FloatingButton;
