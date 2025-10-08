import { forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";

type InputProps = {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onSubmit: (e: React.FormEvent) => void;
	placeholder?: string;
};

export const Input = forwardRef<HTMLTextAreaElement, InputProps>(
	({ value, onChange, onSubmit, placeholder = "Ask or search anything..." }, ref) => {
		return (
			<TextareaAutosize
				ref={ref}
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
	}
);

Input.displayName = "Input";
