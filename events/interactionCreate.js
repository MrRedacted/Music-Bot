module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered the '${interaction.commandName}' command.`);
	},
};