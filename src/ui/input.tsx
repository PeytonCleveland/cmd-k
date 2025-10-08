import TextareaAutosize from "react-textarea-autosize";

type InputProps = {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onSubmit: (e: React.FormEvent) => void;
	placeholder?: string;
};

export const Input = ({
	value,
	onChange,
	onSubmit,
	placeholder = "Ask or search anything...",
}: InputProps) => {
	return (
		<TextareaAutosize
			className="cmdk-input"
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			onKeyDown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					onSubmit(e as unknown as React.FormEvent);
				}
			}}
			maxRows={5}
		/>
	);
};
