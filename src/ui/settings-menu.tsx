import { DropdownMenu } from "radix-ui";
import { Icons } from "./icons";

export const SettingsMenu = () => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild>
				<button
					type="button"
					className="cmdk-settings-menu-trigger"
					aria-label="Settings"
				>
					<Icons.LogoMarkDark style={{ width: 18, height: 18 }} />
				</button>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className="cmdk-settings-menu-content"
					align="start"
					side="right"
					sideOffset={8}
				>
					<DropdownMenu.Item
						className="cmdk-settings-menu-item"
						onSelect={() => console.log("Settings clicked")}
					>
						Settings
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className="cmdk-settings-menu-item"
						onSelect={() => console.log("About clicked")}
					>
						About
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};
