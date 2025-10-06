import type { Meta, StoryObj } from "@storybook/react-vite";
import { CmdK } from "../src/cmd-k";

const meta = {
	title: "Components/CmdK",
	component: CmdK,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		layout: {
			control: "select",
			options: ["modal", "docked", "fullscreen"],
		},
		defaultOpen: {
			control: "boolean",
		},
		dockedWidth: {
			control: { type: "range", min: 280, max: 600, step: 20 },
		},
	},
} satisfies Meta<typeof CmdK>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Modal: Story = {
	args: {
		projectId: "demo-project",
		assistantId: "demo-assistant",
		layout: "modal",
		defaultOpen: true,
	},
};

export const Docked: Story = {
	args: {
		projectId: "demo-project",
		assistantId: "demo-assistant",
		layout: "docked",
		defaultOpen: true,
		dockedWidth: 480,
	},
};

export const Fullscreen: Story = {
	args: {
		projectId: "demo-project",
		assistantId: "demo-assistant",
		layout: "fullscreen",
		defaultOpen: true,
	},
};

export const CustomWidth: Story = {
	args: {
		projectId: "demo-project",
		assistantId: "demo-assistant",
		layout: "docked",
		defaultOpen: true,
		dockedWidth: 500,
	},
};
