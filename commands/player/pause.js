import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the player");

export async function execute(interaction, subscriptions) {
  const subscription = subscriptions.get(interaction.guildId);
  if (subscription) {
    subscription.audioPlayer.pause();
    await interaction.reply({
      content: "Paused!",
    });
  } else {
    await interaction.reply({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
