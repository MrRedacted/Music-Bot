const ytsr = require('ytsr');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Searches YouTube and returns the top 10 results (and their URL for use with the play command)')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name of the song/video to search for')
                .setRequired(true)),
    async execute(interaction) {
        const song = interaction.options.get('song').value;

        const filters = await ytsr.getFilters(song);
        const filter = filters.get('Type').get('Video');
        const options = { pages: 1 };
        const searchResults = await ytsr(filter.url, options);

        const showableResults = searchResults.items
            .slice(0, 10)
            .map((video, index) => `${index + 1}) ${video.title}\n\tURL to use: <${video.url}>`)
            .join('\n');

        await interaction.reply(`${showableResults}`);
    }
};