const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { execute } = require('./play');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a specific item from the queue')
        .addStringOption(option =>
            option.setName('index')
                .setDescription('The index of the song you would like to remove from the queue')
                .setRequired(true)),
    async execute(interaction, subscriptions) {
        let subscription = subscriptions.get(interaction.guildId);
        const songIndex = Number(interaction.options.get('index').value);

        if (isNaN(songIndex)) {
            await interaction.reply('You must enter a number!');
            return;
        }

        if (subscription) {
            const queueItem = subscription.queue[songIndex - 1];
            if (songIndex - 1 === 0) {
                subscription.audioPlayer.stop();
                await interaction.reply('Skipped song!');
            } else if (queueItem) {
                subscription.queue.splice(songIndex - 1, 1);
                await interaction.reply(`Removed ${queueItem.title} from the queue!`);
            } else {
                await interaction.reply(`There is nothing in queue position ${songIndex}`);
            }
        } else {
            await interaction.reply('Not playing in this server!');
        }
    }
}