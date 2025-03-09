import { Interaction, MessageFlags } from "discord.js";
import { log, logError } from "../../../utilities";
import { commands } from "../command-manager";
import createBotCommandEntry from "../../database/create-bot-command-entry";

async function onInteractionCreate(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
    createBotCommandEntry({
      id: 0,
      commandName: interaction.commandName,
      commandOptions: JSON.stringify(interaction.options.data),
      userDiscriminator: interaction.user.username,
      userIconUrl: interaction.user.avatarURL()!,
      channelName: interaction.channel!.id,
      guildName: interaction.guild!.name,
      guildIconUrl: interaction.guild!.iconURL()!,
      timestamp: interaction.createdTimestamp,
    });
  } catch (error) {
    logError(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  log(`Command "${interaction.commandName}" executed by ${interaction.user.tag}`);
}

export default onInteractionCreate;
