import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("replay")
  .setDescription("Replay the last played song");

export async function execute(interaction, subscriptions) {
  const subscription = subscriptions.get(interaction.guildId);

  await interaction.deferReply();

  if (subscription) {
    try {
      const replayTrack = subscription.lastPlayed;
      if (Object.keys(replayTrack).length) {
        subscription.enqueue(replayTrack);
        await interaction.followUp({
          content: `Enqueued **${replayTrack.title}**`,
        });
      } else {
        await interaction.followUp({
          content: "Nothing has been played yet!",
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: "Failed to replay track, please try again later!",
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    await interaction.followUp({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}

