import clsx from "clsx";
import { type FC, useEffect, useState } from "react";
import { DockedLayout } from "./layouts/docked";
import { FullscreenLayout } from "./layouts/fullscreen";
import { ModalLayout } from "./layouts/modal";
import { EmptyState } from "./ui/empty-state";
import { Footer } from "./ui/footer";
import { Header } from "./ui/header";
import { HistoryPanel } from "./ui/history-panel";
import { Input } from "./ui/input";

export type CmdKProps = {
	projectId: string;
	assistantId: string;
	/** Layout mode */
	layout?: "modal" | "docked" | "fullscreen";
	/** Open on mount */
	defaultOpen?: boolean;
	/** Docked width in px */
	dockedWidth?: number;
	/** Optional className for outer shell */
	className?: string;
};

export const CmdK: FC<CmdKProps> = ({
	projectId,
	assistantId,
	layout = "modal",
	defaultOpen = false,
	dockedWidth = 480,
	className,
}) => {
	const [open, setOpen] = useState(defaultOpen);
	const [input, setInput] = useState("");
	const [historyOpen, setHistoryOpen] = useState(false);

	const handleSubmit = () => {
		if (!input.trim()) return;
		// TODO: Handle message submission
		console.log("Submit:", input);
		setInput("");
	};

	const handleToggleHistory = () => {
		setHistoryOpen((prev) => !prev);
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
			if (metaK) {
				e.preventDefault();
				setOpen((o) => !o);
			}
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	const showCloseButton = layout === "docked" || layout === "fullscreen";

	const content = (
		<div
			className={clsx("cmdk", className)}
			style={
				layout === "docked"
					? { width: dockedWidth, height: "100vh", borderRadius: 0 }
					: layout === "fullscreen"
						? { width: "100vw", height: "100vh" }
						: undefined
			}
			role="dialog"
			aria-label="AI Assistant"
		>
			<HistoryPanel
				isOpen={historyOpen}
				onClose={() => setHistoryOpen(false)}
			/>
			<Header
				onToggleHistory={handleToggleHistory}
				historyOpen={historyOpen}
				onClose={() => setOpen(false)}
				showClose={showCloseButton}
			/>
			<EmptyState />
			<Input value={input} onChange={setInput} onSubmit={handleSubmit} />
			<Footer />
		</div>
	);

	if (layout === "modal") {
		return (
			<ModalLayout open={open} onOpenChange={setOpen}>
				{content}
			</ModalLayout>
		);
	}

	if (layout === "docked") {
		return <DockedLayout open={open}>{content}</DockedLayout>;
	}

	if (layout === "fullscreen") {
		return <FullscreenLayout open={open}>{content}</FullscreenLayout>;
	}

	return null;
};
