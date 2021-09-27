const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the player'),
	async execute(interaction, subscriptions) {
        let subscription = subscriptions.get(interaction.guildId);

        if (subscription) {
			subscription.audioPlayer.pause();
			await interaction.reply({ content: `Paused!`, ephemeral: true });
		} else {
			await interaction.reply('Not playing in this server!');
		}
    }
};