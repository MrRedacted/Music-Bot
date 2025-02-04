import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Tell the player to leave the voice channel");

export async function execute(interaction, subscriptions) {
  const subscription = subscriptions.get(interaction.guildId);
  if (subscription) {
    subscription.voiceConnection.destroy();
    subscriptions.delete(interaction.guildId);
    await interaction.reply({
      content: "Left channel",
    });
  } else {
    await interaction.reply({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
