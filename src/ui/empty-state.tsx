import { Icons } from "./icons";

type EmptyStateProps = {
	firstName?: string;
	greeting?: string;
};

export const EmptyState = ({ firstName, greeting: customGreeting }: EmptyStateProps) => {
	let greeting = "Hi, how can I help you today?";

	if (customGreeting) {
		// Replace {first_name} placeholder with actual first name
		greeting = firstName
			? customGreeting.replace("{first_name}", firstName)
			: customGreeting.replace("Hi {first_name}, ", "Hi, ");
	} else {
		greeting = firstName
			? `Hi ${firstName}, how can I help you today?`
			: "Hi, how can I help you today?";
	}

	return (
		<div className="cmdk-empty-state">
			<div className="cmdk-empty-state-icon">
				<Icons.LogoMark style={{ width: 40, height: 40 }} />
			</div>
			<div>
				<h4 className="cmdk-empty-state-title">{greeting}</h4>
			</div>
		</div>
	);
};
