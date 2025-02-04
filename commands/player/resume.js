import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the player");

export async function execute(interaction, subscriptions) {
  const subscription = subscriptions.get(interaction.guildId);

  if (subscription) {
    subscription.audioPlayer.unpause();
    await interaction.reply({ content: `Unpaused!` });
  } else {
    await interaction.reply({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}

