import React, { useState } from "react";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FloatingButtonDiv = styled.div`
	position: absolute;
	bottom: 50px;
	right: 50px;
	border-radius: 10px;
	padding: 15px 17px;
	background-color: ${props => props.theme.primaryColor};
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	&:hover {
		opacity: 0.8;
		transition: opacity 0.3s;
	}
`;

const PlusIcon = styled(FontAwesomeIcon)`
	transform: ${props => (props.active ? "rotate(45deg)" : "")};
	transition: transform 0.5s;
`;

const InputBar = styled.input`
	height: 20px;
	width: ${props => (props.active ? "300px" : "0px")};
	padding: ${props => (props.active ? "1px" : "0")};
	border: ${props => (props.active ? "1px" : "0px")} solid #ced4da;
	margin: ${props => (props.active ? "0 16px 0 0" : "0")};
	border-radius: 0.25rem;
	transition: all 0.5s;
	transition-delay: ${props => (props.active ? "0s" : "0.5s")};
`;

const FloatingButton = () => {
	const [active, setActive] = useState(false);
	const [input, changeInput] = useState("");
	return (
		<FloatingButtonDiv active={active}>
			<InputBar
				active={active}
				value={input}
				onChange={e => changeInput(e.target.value)}
				placeholder="여기에 검색을 하세요!"
			/>
			<PlusIcon
				icon={faPlus}
				active={active}
				onClick={() => setActive(!active)}
			/>
		</FloatingButtonDiv>
	);
};

export default FloatingButton;
