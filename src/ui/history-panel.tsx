type HistoryPanelProps = {
	isOpen: boolean;
	onClose: () => void;
};

export const HistoryPanel = ({ isOpen, onClose }: HistoryPanelProps) => {
	return (
		<>
			<button
				type="button"
				className={`cmdk-history-overlay ${isOpen ? "cmdk-history-overlay-open" : ""}`}
				onClick={onClose}
				aria-label="Close history panel"
				tabIndex={-1}
			/>
			<div
				className={`cmdk-history-panel ${isOpen ? "cmdk-history-panel-open" : ""}`}
			>
				<div className="cmdk-history-header">
					<h3>History</h3>
				</div>
				<div className="cmdk-history-content">
					<div className="cmdk-history-empty">No conversations yet</div>
				</div>
			</div>
		</>
	);
};
