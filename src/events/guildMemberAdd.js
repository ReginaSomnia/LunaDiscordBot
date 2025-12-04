import { Events } from "discord.js";

export default {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const { client } = member;
		const welcomeChannelId = client.config.welcomeChannelId;

		if (!welcomeChannelId) return;

		//? https://discord.js.org/docs/packages/discord.js/14.25.1/GuildMember:Class
		const channel = member.guild.channels.cache.get(welcomeChannelId);
		if (!channel) return;

		const message = client.strings.welcome.message.replace("{user}", `<@${member.id}>`);

		try {
			await channel.send(message);
		} catch (error) {
			console.error(`Could not send welcome message to ${channel.name}:`, error);
		}
	},
};
