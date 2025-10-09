import type React from "react";
import { Icons } from "./icons";

type LogoProps = {
	theme?: "light" | "dark" | "system";
	style?: React.CSSProperties;
	className?: string;
};

export const Logo = ({ theme, style, className }: LogoProps) => {
	const LogoComponent = theme === "light" ? Icons.LogoMark : Icons.LogoMarkDark;

	return <LogoComponent style={style} className={className} />;
};
