import React from "react";
import { ThemeProvider } from "styled-components";

import Theme from "./Theme";

function App() {
	return (
		<ThemeProvider theme={Theme}>
			<div>Hello HackDay</div>
		</ThemeProvider>
	);
}

export default App;
