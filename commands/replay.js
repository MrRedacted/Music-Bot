const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Replay the last played song'),
    async execute(interaction, subscriptions) {
        let subscription = subscriptions.get(interaction.guildId);

        await interaction.deferReply();

        if (subscription) {
            try {
                const replayTrack = subscription.lastPlayed;
                if (Object.keys(replayTrack).length) {
                    subscription.enqueue(replayTrack);
                    await interaction.editReply(`Enqueued **${replayTrack.title}**`);
                } else {
                    await interaction.editReply('Nothing has been played yet!')
                }
            } catch (error) {
                console.warn(error);
                await interaction.editReply('Failed to replay track, please try again later!');
            }
        } else {
            await interaction.editReply('Not playing in this server!');
        }
    }
};