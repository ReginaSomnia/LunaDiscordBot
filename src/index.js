import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import loadConfig from "./utils/config.js";
import events from "./events/index.js";
import commands from "./commands/index.js";

// Load environment variables
dotenv.config();
// Try loading .env.development if in dev mode
if (fs.existsSync(".env.development")) {
	dotenv.config({ path: ".env.development" });
}

// Environment Variable Validation
const requiredEnvVars = ["DISCORD_TOKEN", "CLIENT_ID", "WELCOME_CHANNEL_ID", "GENERAL_CHANNEL_ID"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
	console.error(`[ERROR] Missing required environment variables: ${missingEnvVars.join(", ")}`);
	process.exit(1);
}

const { config, strings } = loadConfig();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.commands = new Collection();
client.config = config;
client.strings = strings;

// Event Handler
for (const event of events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Command Handler
for (const command of commands) {
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] A command is missing a required "data" or "execute" property.`);
	}
}

client.login(process.env.DISCORD_TOKEN);
