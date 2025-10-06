import { Icons } from "./icons";

export const EmptyState = () => {
	return (
		<div className="cmdk-empty-state">
			<div className="cmdk-empty-state-icon">
				<Icons.LogoMark style={{ width: 40, height: 40 }} />
			</div>
			<div>
				<h4 className="cmdk-empty-state-title">
					Hi Peyton, how can I help
					<br /> you today?
				</h4>
			</div>
		</div>
	);
};
