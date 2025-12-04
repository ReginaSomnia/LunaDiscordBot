import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import commandsList from "./commands/index.js";

dotenv.config();
// Try loading .env.development if in dev mode
if (fs.existsSync(".env.development")) {
	dotenv.config({ path: ".env.development" });
}

const commands = [];

for (const command of commandsList) {
	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] A command is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: commands,
		});

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
