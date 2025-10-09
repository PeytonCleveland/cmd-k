import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import clsx from "clsx";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { DockedLayout } from "./layouts/docked";
import { FullscreenLayout } from "./layouts/fullscreen";
import { ModalLayout } from "./layouts/modal";
import { EmptyState } from "./ui/empty-state";
import { Footer } from "./ui/footer";
import { Header } from "./ui/header";
import { HistoryPanel } from "./ui/history-panel";
import { Input } from "./ui/input";
import { getFirstNameFromJWT } from "./utils/jwt";

export type CmdKProps = {
	assistantId: string;
	/** API base URL. Defaults to https://api.dorado.dev for production. Override for self-hosted or dev environments. */
	apiUrl?: string;
	/** Layout mode */
	layout?: "modal" | "docked" | "fullscreen";
	/** Controlled open state */
	open?: boolean;
	/** Callback when open state changes */
	onOpenChange?: (open: boolean) => void;
	/** Open on mount (uncontrolled mode) */
	defaultOpen?: boolean;
	/** Key to use with Cmd/Ctrl to toggle (e.g., "k" for Cmd+K). Set to false to disable. Default: "k" */
	keyboardShortcut?: string | false;
	/** Docked width in px */
	dockedWidth?: number;
	/** Optional className for outer shell */
	className?: string;
	/** User JWT token for authentication */
	jwt?: string;
};

export const CmdK: FC<CmdKProps> = ({
	assistantId,
	apiUrl = "https://api.dorado.dev",
	layout: initialLayout = "modal",
	open: controlledOpen,
	onOpenChange,
	defaultOpen = false,
	keyboardShortcut = "k",
	dockedWidth = 480,
	className,
	jwt,
}) => {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const [historyOpen, setHistoryOpen] = useState(false);
	const [layout, setLayout] = useState(initialLayout);
	const [input, setInput] = useState("");
	const threadRef = useRef<HTMLDivElement>(null);

	const firstName = jwt ? getFirstNameFromJWT(jwt) : undefined;

	const { data: assistant } = useSWR(
		jwt ? [`${apiUrl}/assistants/${assistantId}`, jwt] : null,
		async ([url, token]) => {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch assistant");
			}
			return response.json() as Promise<{
				id: string;
				name: string;
				description: string | null;
				provider: string;
				model: string;
				systemPrompt: string;
				greeting: string;
				title: string;
			}>;
		},
	);

	const { messages, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: `${apiUrl}/assistants/chat`,
			headers: jwt
				? {
						Authorization: `Bearer ${jwt}`,
					}
				: {},
			body: {
				assistantId,
			},
		}),
	});

	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;

	const handleOpenChange = useCallback(
		(newOpen: boolean) => {
			if (!isControlled) {
				setInternalOpen(newOpen);
			}
			onOpenChange?.(newOpen);
		},
		[isControlled, onOpenChange],
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage({ text: input });
		setInput("");
	};

	const handleToggleHistory = () => {
		setHistoryOpen((prev) => !prev);
	};

	const handleToggleDock = () => {
		setLayout((prev) => (prev === "docked" ? "modal" : "docked"));
		if (layout === "modal") {
			handleOpenChange(true);
		}
	};

	const handleToggleFullscreen = () => {
		setLayout((prev) => (prev === "fullscreen" ? "modal" : "fullscreen"));
	};

	useEffect(() => {
		if (keyboardShortcut === false) return;

		const onKey = (e: KeyboardEvent) => {
			const matchesShortcut =
				(e.metaKey || e.ctrlKey) &&
				e.key.toLowerCase() === keyboardShortcut.toLowerCase();

			if (matchesShortcut) {
				e.preventDefault();
				handleOpenChange(!open);
			}
			if (e.key === "Escape") handleOpenChange(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [keyboardShortcut, open, handleOpenChange]);

	// biome-ignore lint:correctness/useExhaustiveDependencies
	useEffect(() => {
		if (threadRef.current) {
			threadRef.current.scrollTop = threadRef.current.scrollHeight;
		}
	}, [messages]);

	const isDocked = layout === "docked";
	const showCloseButton = isDocked || layout === "fullscreen";

	const content = (
		<div
			className={clsx("cmdk", className)}
			style={
				isDocked
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
				isDocked={isDocked}
			/>
			<Header
				onToggleHistory={handleToggleHistory}
				historyOpen={historyOpen}
				onClose={() => handleOpenChange(false)}
				showClose={showCloseButton}
				isDocked={isDocked}
				assistantName={assistant?.name}
				assistantTitle={assistant?.title}
			/>
			{messages.length === 0 ? (
				<EmptyState firstName={firstName} greeting={assistant?.greeting} />
			) : (
				<div className="cmdk-thread" ref={threadRef}>
					{messages.map((message: UIMessage) => (
						<div
							key={message.id}
							className={
								message.role === "user"
									? "cmdk-message-user"
									: "cmdk-message-assistant"
							}
						>
							{message.parts.map((part, index) => {
								if (part.type === "text") {
									return (
										<span key={`${message.id}-${index}`}>{part.text}</span>
									);
								}
								return null;
							})}
						</div>
					))}
				</div>
			)}
			<Input
				value={input}
				onChange={handleInputChange}
				onSubmit={handleSubmit}
			/>
			<Footer
				onToggleDock={handleToggleDock}
				onToggleFullscreen={handleToggleFullscreen}
				isDocked={isDocked}
				layout={layout}
			/>
		</div>
	);

	if (layout === "modal") {
		return (
			<ModalLayout open={open} onOpenChange={handleOpenChange}>
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
