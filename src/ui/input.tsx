import TextareaAutosize from "react-textarea-autosize";

type InputProps = {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
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
			onChange={(e) => onChange(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && !e.shiftKey) {
					e.preventDefault();
					onSubmit();
				}
			}}
			maxRows={5}
		/>
	);
};
