import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with 'Pong!'");

export async function execute(interaction) {
  return await interaction.reply({
    content: "Pong!",
    flags: MessageFlags.Ephemeral,
  });
}
