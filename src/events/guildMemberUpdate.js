import { Events } from "discord.js";

export default {
	name: Events.GuildMemberUpdate,
	async execute(oldMember, newMember) {
		const { client } = newMember;
		const generalChannelId = client.config.generalChannelId;

		if (!generalChannelId) return;

		// Check if the member started boosting
		//? https://discord.js.org/docs/packages/discord.js/14.25.1/GuildMember:Class#premiumSince
		const oldStatus = oldMember.premiumSince;
		const newStatus = newMember.premiumSince;

		if (!oldStatus && newStatus) {
			const channel = newMember.guild.channels.cache.get(generalChannelId);
			if (!channel) return;

			const message = client.strings.boost.message.replace("{user}", `<@${newMember.id}>`);

			try {
				await channel.send(message);
			} catch (error) {
				console.error(`Could not send boost message to ${channel.name}:`, error);
			}
		}
	},
};
