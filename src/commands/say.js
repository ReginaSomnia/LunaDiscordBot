import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } from "discord.js";
import { parseEmojis } from "../utils/textUtils.js";

export default {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Let the bot say something! You master puppeteer!")
		.addStringOption((option) =>
			option.setName("title").setDescription("The title of the embed").setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("description")
				.setDescription("The description of the embed")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option.setName("image").setDescription("Image URL (optional)").setRequired(false),
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Channel to send the message to (optional)")
				.setRequired(false)
				.addChannelTypes(ChannelType.GuildText),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		let title = interaction.options.getString("title");
		let description = interaction.options.getString("description");
		const image = interaction.options.getString("image");
		const channel = interaction.options.getChannel("channel") || interaction.channel;

		// Parse emojis
		title = parseEmojis(title, interaction.client);
		description = parseEmojis(description, interaction.client);

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(description)
			.setColor(0xe100ff)
			.setTimestamp();

		if (image) {
			try {
				new URL(image);
				embed.setImage(image);
			} catch (e) {
				return interaction.reply({
					content: `Invalid image URL provided: \`${image}\`. Please provide a valid URL starting with http:// or https://`,
					ephemeral: true,
				});
			}
		}

		try {
			await channel.send({ embeds: [embed] });
			await interaction.reply({ content: `Message sent to ${channel}`, ephemeral: true });
		} catch (error) {
			console.error("[Say Command Error]", error);
			console.error("Command Inputs:", {
				title,
				description,
				image,
				channel: channel.name,
				channelId: channel.id,
				user: interaction.user.tag,
			});

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "Failed to send message.",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "Failed to send message.",
					ephemeral: true,
				});
			}
		}
	},
};
