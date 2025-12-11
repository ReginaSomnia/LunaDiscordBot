import { Events } from "discord.js";

export default {
	name: Events.GuildMemberUpdate,
	async execute(oldMember, newMember) {
		const { client } = newMember;

		// Feature: Boost Message
		if (client.config.enableBoostMessage) {
			const generalChannelId = client.config.generalChannelId;
			if (generalChannelId) {
				// Check if the member started boosting
				//? https://discord.js.org/docs/packages/discord.js/14.25.1/GuildMember:Class#premiumSince
				const oldStatus = oldMember.premiumSince;
				const newStatus = newMember.premiumSince;

				if (!oldStatus && newStatus) {
					let channel;
					try {
						channel = await newMember.guild.channels.fetch(generalChannelId);
					} catch (error) {
						console.error(
							`Could not fetch general channel (${generalChannelId}):`,
							error,
						);
					}

					if (channel) {
						const message = client.strings.boost.message.replace(
							"{user}",
							`<@${newMember.id}>`,
						);
						try {
							await channel.send(message);
						} catch (error) {
							console.error(
								`Could not send boost message to ${channel.name}:`,
								error,
							);
						}
					}
				}
			}
		}

		// Feature: Unverified Role Detection
		if (client.config.enableUnverifiedRoleDetection) {
			const unverifiedRoleId = client.config.unverifiedRoleId;
			const logChannelId = client.config.logChannelId;

			if (unverifiedRoleId && logChannelId) {
				const oldHasRole = oldMember.roles.resolve(unverifiedRoleId);
				const newHasRole = newMember.roles.resolve(unverifiedRoleId);

				if (!oldHasRole && newHasRole) {
					let channel;
					try {
						channel = await newMember.guild.channels.fetch(logChannelId);
					} catch (error) {
						console.error(`Could not fetch log channel (${logChannelId}):`, error);
					}

					if (channel) {
						const { EmbedBuilder } = await import("discord.js");
						const embed = new EmbedBuilder()
							.setTitle("Unverified Role Assigned")
							.setDescription(
								`<@${newMember.id}> has been assigned the unverified role.`,
							)
							.setColor(0xff0000)
							.setTimestamp();

						try {
							await channel.send({ embeds: [embed] });

							if (client.config.enableBanAction) {
								await newMember.ban({ reason: client.config.banReason });
								await channel.send({
									content: `User <@${newMember.id}> has been banned. Reason: ${client.config.banReason}`,
								});
							}
						} catch (error) {
							//? Check if there's a constant for error codes in exceptions from discord.js
							if (error?.code == 50013) {
								console.error(
									`Insufficient permissions to ban user ${newMember.user.tag}`,
								);
							} else {
								console.error(
									`Error in unverified role detection for ${newMember.user.tag}:`,
									error,
								);
							}
						}
					}
				}
			}
		}
	},
};
