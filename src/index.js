const fs = require('fs');
const { Client, Collection, IntentsBitField } = require('discord.js');
const { token } = require(__dirname + '/../config.json');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages] });

client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/../commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(__dirname + '/../events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(__dirname + `/../commands/${file}`);
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(__dirname + `/../events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const subscriptions = new Map();

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, subscriptions);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
