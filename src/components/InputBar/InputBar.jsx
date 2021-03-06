import React, { useState } from "react";
import styled from "styled-components";
import { Mutation } from "react-apollo";

import { SAVE_CHAT } from "queries";

const InputBarInput = styled.input`
	text-align: right;
	height: 20px;
	width: ${props => (props.active ? "300px" : "0px")};
	padding: ${props => (props.active ? "1px" : "0")};
	border: ${props => (props.active ? "1px" : "0px")} solid #ced4da;
	margin: ${props => (props.active ? "0 16px 0 0" : "0")};
	border-radius: 0.25rem;
	transition: all 0.5s;
	transition-delay: ${props => (props.active ? "0s" : "0.5s")};
	padding-right: ${props => (props.active ? "10px" : "0")};
`;

const InputBar = ({ active }) => {
	const [input, changeInput] = useState("");
	const EnterInput = (event, saveChat) => {
		if (event.key === "Enter") {
			saveChat({
				variables: {
					query: input
				}
			});
			changeInput("");
		}
	};
	return (
		<Mutation mutation={SAVE_CHAT}>
			{(saveChat, _) => (
				<InputBarInput
					active={active}
					value={input}
					onChange={e => changeInput(e.target.value)}
					onKeyPress={e => EnterInput(e, saveChat)}
					placeholder="여기에 검색을 하세요!"
				/>
			)}
		</Mutation>
	);
};

export default InputBar;
