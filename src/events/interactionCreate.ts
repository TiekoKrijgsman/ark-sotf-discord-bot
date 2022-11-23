import { Events } from 'discord.js'

import { DiscordClient } from '../services/discord/DiscordClient.js'
import type { DiscordEvent } from '../services/discord/DiscordEvent.js'

const interactionCreate: DiscordEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
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
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}

export default interactionCreate
