import { Icons } from "./icons";
import { SettingsMenu } from "./settings-menu";

type FooterProps = {
	onToggleDock?: () => void;
	onToggleFullscreen?: () => void;
	isDocked?: boolean;
	layout?: "modal" | "docked" | "fullscreen";
};

export const Footer = ({
	onToggleDock,
	onToggleFullscreen,
	isDocked = false,
	layout = "modal",
}: FooterProps) => {
	return (
		<div className="cmdk-footer">
			<SettingsMenu />
			<div className="cmdk-footer-actions">
				{onToggleDock && (
					<button
						className="cmdk-footer-dock-button"
						data-docked={isDocked}
						type="button"
						onClick={onToggleDock}
						aria-label={isDocked ? "Undock" : "Dock to right"}
						title={isDocked ? "Undock" : "Dock to right"}
					>
						<Icons.PanelRight size={18} />
					</button>
				)}
				{onToggleFullscreen && (
					<button
						className="cmdk-footer-fullscreen-button"
						data-fullscreen={layout === "fullscreen"}
						type="button"
						onClick={onToggleFullscreen}
						aria-label={
							layout === "fullscreen" ? "Exit fullscreen" : "Enter fullscreen"
						}
						title={
							layout === "fullscreen" ? "Exit fullscreen" : "Enter fullscreen"
						}
					>
						<Icons.Fullscreen size={18} />
					</button>
				)}
				<button
					className="cmdk-footer-submit-button"
					type="button"
					aria-label="Submit"
					title="Submit"
				>
					<Icons.SubdirectoryArrowLeft size={18} />
				</button>
			</div>
		</div>
	);
};
