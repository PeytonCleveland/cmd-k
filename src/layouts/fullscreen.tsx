import type { ReactNode } from "react";

type FullscreenLayoutProps = {
	open: boolean;
	children: ReactNode;
};

export const FullscreenLayout = ({ open, children }: FullscreenLayoutProps) => {
	if (!open) return null;

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				background: "var(--cmdk-bg)",
				zIndex: 60_000,
			}}
		>
			{children}
		</div>
	);
};
