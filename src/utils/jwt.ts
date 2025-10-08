/**
 * Decode JWT and extract first name from name claim
 */
export const getFirstNameFromJWT = (jwt: string): string | undefined => {
	try {
		const parts = jwt.split(".");
		if (parts.length !== 3 || !parts[1]) return undefined;

		// Decode the payload (second part)
		const payload = JSON.parse(atob(parts[1]));
		const name = payload.name;

		if (typeof name === "string") {
			// Extract first name (everything before the first space)
			return name.split(" ")[0];
		}
	} catch (error) {
		console.error("Failed to decode JWT:", error);
	}
	return undefined;
};
