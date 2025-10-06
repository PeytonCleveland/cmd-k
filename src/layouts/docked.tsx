import type { ReactNode } from "react";

type DockedLayoutProps = {
	open: boolean;
	children: ReactNode;
};

export const DockedLayout = ({ open, children }: DockedLayoutProps) => {
	if (!open) return null;

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				right: 0,
				bottom: 0,
				display: "flex",
				zIndex: 60_000,
			}}
		>
			{children}
		</div>
	);
};
