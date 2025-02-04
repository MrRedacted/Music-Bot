import ytsr from "@distube/ytsr";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
  .setName("search")
  .setDescription(
    "Searches YouTube and returns the top 10 results (and their URL for use with the play command)",
  )
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The name of the song/video to search for")
      .setRequired(true),
  );

export async function execute(interaction) {
  const song = interaction.options.getString("song");
  const searchResults = await ytsr(song, { limit: 10, type: "video" });
  const showableResults = searchResults.items
    .slice(0, 10)
    .map(
      (video, index) =>
        `${index + 1}) ${video.name}\n\tURL to use: <${video.url}>`,
    )
    .join("\n");

  await interaction.reply({ content: `${showableResults}` });
}

