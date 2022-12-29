import { Events, GuildMember } from 'discord.js'

import { DISCORD_SURVIVOR_ROLE_ID, DISCORD_TOURNAMENT_ROLE_ID, SURVIVOR_BUTTON_ID, TOURNAMENT_BUTTON_ID } from '../configuration.js'
import { DiscordClient } from '../services/discord/DiscordClient.js'
import type { DiscordEvent } from '../services/discord/DiscordEvent.js'

const interactionCreate: DiscordEvent<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    if (interaction.isButton() && interaction.member instanceof GuildMember) {
      if (interaction.customId === SURVIVOR_BUTTON_ID) {
        if (interaction.member.roles.cache.has(DISCORD_SURVIVOR_ROLE_ID)) {
          await interaction.member.roles.remove(DISCORD_SURVIVOR_ROLE_ID)
          await interaction.reply({
            content: 'You are no longer a Survivor. <:sadpanda:1043958666690310274>',
            ephemeral: true
          })
          return
        }
        await interaction.member.roles.add(DISCORD_SURVIVOR_ROLE_ID)
        await interaction.reply({
          content: 'You are now a Survivor! <:Bob:1045749690022494208>',
          ephemeral: true
        })
        return
      }

      if (interaction.customId === TOURNAMENT_BUTTON_ID) {
        if (interaction.member.roles.cache.has(DISCORD_TOURNAMENT_ROLE_ID)) {
          await interaction.member.roles.remove(DISCORD_TOURNAMENT_ROLE_ID)
          await interaction.reply({
            content: 'You are no longer a Tournament participant. <:sadpanda:1043958666690310274>',
            ephemeral: true
          })
          return
        }

        await interaction.member.roles.add(DISCORD_TOURNAMENT_ROLE_ID)
        await interaction.reply({
          content: `You are now a Tournament participant! <:dodowithit:1055076101728247829>`,
          ephemeral: true
        })
      }

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
