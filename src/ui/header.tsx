import { Icons } from "./icons";

type HeaderProps = {
	onToggleHistory: () => void;
	historyOpen: boolean;
	onClose?: () => void;
	showClose?: boolean;
	isDocked?: boolean;
};

export const Header = ({
	onToggleHistory,
	historyOpen,
	onClose,
	showClose = false,
	isDocked = false,
}: HeaderProps) => {
	return (
		<div className="cmdk-header" data-docked={isDocked}>
			<button
				type="button"
				className={`cmdk-header-history-button ${historyOpen ? "cmdk-header-history-button-open" : ""}`}
				onClick={onToggleHistory}
				aria-label="Toggle history"
			>
				{historyOpen ? <Icons.Sidebar /> : <Icons.SidebarFilled />}
			</button>
			<h3>Assistant</h3>
			{showClose && onClose && (
				<button
					type="button"
					className="cmdk-header-close-button"
					onClick={onClose}
					aria-label="Close"
				>
					×
				</button>
			)}
		</div>
	);
};
