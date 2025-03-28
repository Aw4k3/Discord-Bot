import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { randomInt } from "../../../../utilities";
import { BotCommand } from "../../../../models";

const data = new SlashCommandBuilder()
  .setName("how")
  .setDescription('How "somthing" is someone')
  .addStringOption((option) =>
    option.setName("criteria").setDescription("What to measure the percentage of").setRequired(true)
  )
  .addMentionableOption((option) => option.setName("user").setDescription("Who should the criteria be tested against"));

async function execute(interaction: CommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle(`How ${interaction.options.get("criteria")?.value as string}`)
    .setDescription(`${interaction.options.get("user")?.member || interaction.member}: ${randomInt(0, 100)}%`);

  await interaction.reply({ embeds: [embed] });
}

export default { data, execute } satisfies BotCommand;
