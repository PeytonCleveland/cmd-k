import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

type ModalLayoutProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: ReactNode;
};

export const ModalLayout = ({
	open,
	onOpenChange,
	children,
}: ModalLayoutProps) => {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.45)",
						backdropFilter: "blur(2px)",
						WebkitBackdropFilter: "blur(2px)",
					}}
					onClick={() => onOpenChange(false)}
				/>
				<Dialog.Content
					style={{
						position: "fixed",
						inset: 0,
						display: "grid",
						placeItems: "center",
						padding: 16,
						pointerEvents: "none",
					}}
				>
					<Dialog.Title asChild>
						<span className="sr-only">Command Palette</span>
					</Dialog.Title>
					<div style={{ pointerEvents: "auto" }}>{children}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
