const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the player'),
	async execute(interaction, subscriptions) {
        let subscription = subscriptions.get(interaction.guildId);

        if (subscription) {
			subscription.audioPlayer.unpause();
			await interaction.reply({ content: `Unpaused!`, ephemeral: true });
		} else {
			await interaction.reply('Not playing in this server!');
		}
    }
};