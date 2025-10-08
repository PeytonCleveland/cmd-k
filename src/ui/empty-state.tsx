import { Icons } from "./icons";

type EmptyStateProps = {
	firstName?: string;
};

export const EmptyState = ({ firstName }: EmptyStateProps) => {
	const greeting = firstName
		? `Hi ${firstName}, how can I help`
		: "Hi, how can I help";

	return (
		<div className="cmdk-empty-state">
			<div className="cmdk-empty-state-icon">
				<Icons.LogoMark style={{ width: 40, height: 40 }} />
			</div>
			<div>
				<h4 className="cmdk-empty-state-title">
					{greeting}
					<br /> you today?
				</h4>
			</div>
		</div>
	);
};
