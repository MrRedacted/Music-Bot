const Track = require(__dirname + '/../music/track.js');
const { GuildMember } = require('discord.js');
const MusicSubscription = require(__dirname + '/../music/subscription.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
	getVoiceConnection,
} = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song! or adds to queue if there is already something playing')
		.addStringOption(option =>
			option.setName('song')
				.setDescription('The name or URL of the song to play')
				.setRequired(true)),
	async execute(interaction, subscriptions) {
		let connection = getVoiceConnection(interaction.guild.id);
		let subscription = subscriptions.get(interaction.guildId);
		const channel = interaction.member.voice.channel;

		await interaction.deferReply();

		const song = interaction.options.get('song').value;

		if (!subscription) {
			if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
				const channel = interaction.member.voice.channel;
				subscription = new MusicSubscription(
					joinVoiceChannel({
						channelId: channel.id,
						guildId: channel.guild.id,
						adapterCreator: channel.guild.voiceAdapterCreator,
					}),
					subscriptions,
					interaction.guildId
				);
				subscription.voiceConnection.on('error', console.warn);
				subscriptions.set(interaction.guildId, subscription);
			}
		}

		if (!subscription) {
			await interaction.editReply('Join a voice channel and then try that again!');
			return;
		}

		try {
			await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
		} catch (error) {
			console.warn(error);
			await interaction.editReply('Failed to join voice channel within 20 seconds, please try again later!');
			return;
		}

		try {
			const track = await Track.from(song, {
				onStart() {
					interaction.followUp({ content: `Now playing ${track.title}!`, ephemeral: true }).catch(console.warn);
				},
				onFinish() {
					interaction.followUp({ content: `Finished playing ${track.title}!`, ephemeral: true }).catch(console.warn);
				},
				onError(error) {
					console.warn(error);
					interaction.followUp({ content: `Error: ${error.message}`, ephemeral: true }).catch(console.warn);
				},
			});
			subscription.enqueue(track);
			await interaction.editReply(`Enqueued **${track.title}**`);
		} catch (error) {
			console.warn(error);
			await interaction.editReply('Failed to play track, please try again later!');
		}
	}
};