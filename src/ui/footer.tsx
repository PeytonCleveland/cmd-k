import { SettingsMenu } from "./settings-menu";

export const Footer = () => {
	return (
		<div className="cmdk-footer">
			<SettingsMenu />
			<button className="cmdk-footer-submit-button" type="button">
				<span>Submit</span>
				<kbd className="cmdk-footer-submit-button-key">
					<span>↵</span>
				</kbd>
			</button>
		</div>
	);
};
