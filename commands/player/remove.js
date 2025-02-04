import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove a specific item from the queue")
  .addStringOption((option) =>
    option
      .setName("index")
      .setDescription(
        "The index of the song you would like to remove from the queue",
      )
      .setRequired(true),
  );

export async function execute(interaction, subscriptions) {
  const subscription = subscriptions.get(interaction.guildId);
  const songIndex = Number(interaction.options.getString("index", true));

  if (isNaN(songIndex)) {
    await interaction.reply({
      content: "You must enter a number!",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (subscription) {
    const queueItem = subscription.queue[songIndex - 1];
    if (queueItem) {
      subscription.queue.splice(songIndex - 1, 1);
      await interaction.reply({
        content: `Removed ${queueItem.title} from the queue!`,
      });
    } else {
      await interaction.reply({
        content: `There is nothing in queue position ${songIndex}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  } else {
    await interaction.reply({
      content: "Not playing in this server!",
      flags: MessageFlags.Ephemeral,
    });
  }
}
