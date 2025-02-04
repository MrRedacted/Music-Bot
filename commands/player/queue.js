import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show the queue");

export async function execute(interaction, subscriptions) {
  const subscription = subscriptions.get(interaction.guildId);
  if (subscription) {
    const current =
      subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
        ? "Nothing is currently playing!"
        : `Playing **${subscription.audioPlayer.state.resource.metadata.title}**`;
    const queue = subscription.queue
      .slice(0, 5)
      .map((track, index) => `${index + 1}) ${track.title}`)
      .join("\n");
    await interaction.reply({
      content: `${current}\n\n${queue}`,
      flags: MessageFlags.Ephemeral,
    });
  } else {
    await interaction.reply({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
