import {
  MessageFlags,
  SlashCommandBuilder,
  PermissionsBitField,
} from "discord.js";
import {
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { MusicSubscription } from "../../music/subscription.js";
import { Track } from "../../music/track.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription(
    "Plays a song, or adds to queue if there is already a song playing",
  )
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("Song to be played")
      .setRequired(true),
  );

export async function execute(interaction, subscriptions) {
  let subscription = subscriptions.get(interaction.guildId);
  const song = interaction.options.getString("song", true);
  const voiceChannel = interaction.member.voice.channel;
  const voiceChannelId = interaction.member.voice.channelId;
  if (!voiceChannel) {
    return await interaction.reply({
      content: "You are not connected to a voice channel!",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (
    interaction.guild.members.me.voice.channel &&
    interaction.guild.members.me.voice.channel !== voiceChannel
  ) {
    return await interaction.reply({
      content: "I am already playing in a different voice channel!",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (
    !interaction.guild.members.me.permissions.has(
      PermissionsBitField.Flags.Connect,
    )
  ) {
    return await interaction.reply({
      content: "I do not have permission to join your voice channel!",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (
    !interaction.guild.members.me
      .permissionsIn(voiceChannel)
      .has(PermissionsBitField.Flags.Speak)
  ) {
    return await interaction.reply({
      content: "I do not have permission to speak in your voice channel!",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (!subscription) {
    subscription = new MusicSubscription(
      joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      }),
      subscriptions,
      interaction.guildId,
    );
    subscription.voiceConnection.on("error", console.error);
    subscriptions.set(interaction.guildId, subscription);
  }

  await interaction.deferReply();

  try {
    await entersState(
      subscription.voiceConnection,
      VoiceConnectionStatus.Ready,
      20e3,
    );
  } catch (error) {
    console.error(error);
    return await interaction.followUp({
      content:
        "Failed to join voice channel within 20 seconds, please try again later!",
      flags: MessageFlags.Ephemeral,
    });
  }

  try {
    const track = await Track.from(song, {
      onStart() {
        interaction.followUp({ content: `Now playing ${track.title}!` });
      },
      onFinish() {
        interaction.followUp({ content: `Finished playing ${track.title}!` });
      },
      onError(error) {
        console.error(error);
        interaction.followUp({
          content: `Error: ${error.message}`,
          flags: MessageFlags.Ephemeral,
        });
      },
    });

    subscription.enqueue(track);

    await interaction.followUp({
      content: `${track.title} has been added to the queue!`,
    });
  } catch (error) {
    console.error(error);
    await interaction.followUp({
      content: `Something went wrong while playing the song!`,
      flags: MessageFlags.Ephemeral,
    });
  }
}
