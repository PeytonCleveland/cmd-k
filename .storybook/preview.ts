import type { Preview } from "@storybook/react-vite";
import "../src/styles/tokens.css";
import "../src/styles/base.css";

const preview: Preview = {
	parameters: {
		backgrounds: {
			options: {
				dark: {
					name: "dark",
					value: "#121212",
				},

				light: {
					name: "light",
					value: "#ffffff",
				},
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},

	initialGlobals: {
		backgrounds: {
			value: "dark",
		},
	},
};

export default preview;
