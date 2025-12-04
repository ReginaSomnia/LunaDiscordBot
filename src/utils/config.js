import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadConfig = () => {
	const stringsPath = path.join(__dirname, "../../data/strings.json");
	const strings = JSON.parse(fs.readFileSync(stringsPath, "utf8"));

	const config = {
		welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
		generalChannelId: process.env.GENERAL_CHANNEL_ID,
	};

	return { config, strings };
};

export default loadConfig;
