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
		enableWelcome: process.env.ENABLE_WELCOME !== "false",
		enableBoostMessage: process.env.ENABLE_BOOST_MESSAGE !== "false",
		enableSayCommand: process.env.ENABLE_SAY_COMMAND !== "false",
		enableUnverifiedRoleDetection: process.env.ENABLE_UNVERIFIED_ROLE_DETECTION !== "false",
		unverifiedRoleId: process.env.UNVERIFIED_ROLE_ID,
		logChannelId: process.env.LOG_CHANNEL_ID,
		enableBanAction: process.env.ENABLE_BAN_ACTION !== "false",
		banReason: process.env.BAN_REASON || "Unverified role assigned",
	};

	return { config, strings };
};

export default loadConfig;
