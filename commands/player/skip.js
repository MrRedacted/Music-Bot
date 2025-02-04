import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip a song");

export async function execute(interaction, subscriptions) {
  let subscription = subscriptions.get(interaction.guildId);

  if (subscription) {
    // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
    // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
    // will be loaded and played.
    subscription.audioPlayer.stop();
    await interaction.reply({ content: "Skipped song!" });
  } else {
    await interaction.reply({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
