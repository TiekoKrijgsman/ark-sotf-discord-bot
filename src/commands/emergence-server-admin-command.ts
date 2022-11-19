import {
  PermissionsBitField,
  SlashCommandBuilder,
  SlashCommandStringOption
} from 'discord.js'
import { Rcon } from 'rcon-client'

import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import {
  NITRADO_SERVER_ADMIN_PASSWORD,
  NITRADO_SERVER_IP,
  NITRADO_SERVER_RCON_PORT
} from '../configuration.js'

const emergenceServerAdminCommand: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('emergence-server-admin-command')
    .setDescription('Execute a command on the EMERGENCE Beginners server!')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('command')
        .setDescription(
          'The command to execute on the ARK: SOTF server (e.g: `GetChat`, `ListPlayers`, etc.).'
        )
        .setRequired(true)
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(
      new PermissionsBitField('Administrator').valueOf()
    ),
  execute: async (interaction) => {
    const command = interaction.options.getString('command')
    if (command == null) {
      await interaction.reply(
        `You must provide a command to execute on the ARK: SOTF server.`
      )
      return
    }
    try {
      const rcon = await Rcon.connect({
        host: NITRADO_SERVER_IP,
        port: NITRADO_SERVER_RCON_PORT,
        password: NITRADO_SERVER_ADMIN_PASSWORD
      })
      const serverResult = await rcon.send(command)
      await interaction.reply(serverResult)
    } catch {
      await interaction.reply(
        `Server is restarting or is currently offline. Please try again later.`
      )
    }
  }
}

export default emergenceServerAdminCommand
