import { Events, GuildMember } from 'discord.js'

import { DISCORD_WELCOME_ROLE_ID, SURVIVOR_PRIMARY_BUTTON } from '../configuration.js'
import { DiscordClient } from '../services/discord/DiscordClient.js'
import type { DiscordEvent } from '../services/discord/DiscordEvent.js'

const interactionCreate: DiscordEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (interaction.isButton() && interaction.member instanceof GuildMember && interaction.customId === SURVIVOR_PRIMARY_BUTTON) {
      if (interaction.member.roles.cache.has(DISCORD_WELCOME_ROLE_ID)) {
        await interaction.reply({
          content: 'You already have the Survivor role!',
          ephemeral: true
        })
        return
      }
      await interaction.member.roles.add(DISCORD_WELCOME_ROLE_ID)
      await interaction.reply({
        content: 'You have been given the Survivor role! :tada:',
        ephemeral: true
      })
      return
    }
    if (!interaction.isChatInputCommand()) {
      return
    }
    const discordClient = await DiscordClient.getInstance()
    const command = discordClient.commands.get(interaction.commandName)
    if (command == null) {
      console.error(`Command \`${interaction.commandName}\` not found.`)
      return
    }
    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply('There was an error while executing this command. Please try again later.')
    }
  }
}

export default interactionCreate
