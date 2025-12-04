export const parseEmojis = (text, client) => {
	if (!text) return text;

	return text.replace(/:([a-zA-Z0-9_]+):/g, (match, emojiName) => {
		const emoji = client.emojis.resolve(emojiName);
		return emoji ? emoji : match;
	});
};
