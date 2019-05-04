import React from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

import FloatingButton from "./components/FloatingButton";
import Theme from "./Theme";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const Screen = styled.div`
	height: 100vh;
	width: 100vw;
	display: relative;
`;

function App() {
	return (
		<ThemeProvider theme={Theme}>
			<Screen>
				<GlobalStyle />
				Hello HackDay
				<FloatingButton />
			</Screen>
		</ThemeProvider>
	);
}

export default App;
