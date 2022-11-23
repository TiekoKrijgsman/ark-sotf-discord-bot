import { SlashCommandBuilder } from 'discord.js'

import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import { NITRADO_BEGINNERS_GAMESERVER_ID } from '../configuration.js'
import type { NitradoGameServer, NitradoResponse } from '../services/nitrado.js'
import { nitradoAPI } from '../services/nitrado.js'

const emergenceServerStatus: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('emergence-server-status')
    .setDescription(
      'Replies with the status of the EMERGENCE Beginners server!'
    )
    .toJSON(),
  execute: async (interaction) => {
    try {
      const { gameserver } = (
        await nitradoAPI.get<NitradoResponse<NitradoGameServer>>(
          `/services/${NITRADO_BEGINNERS_GAMESERVER_ID}/gameservers`
        )
      ).data.data
      const IN_MATCH_IDENTIFIER = '[In-Match] '
      const isInMatch =
        gameserver.query.server_name.startsWith(IN_MATCH_IDENTIFIER)
      const status = isInMatch ? 'In Match' : 'Lobby'
      const serverName = gameserver.query.server_name.replace(
        IN_MATCH_IDENTIFIER,
        ''
      )
      await interaction.reply(
        `Server Name: \`${serverName}\`\nPlayers: ${gameserver.query.player_current}/${gameserver.query.player_max}\nStatus: ${status}`
      )
    } catch (error) {
      console.error(error)
      await interaction.reply(
        `Server is restarting or is currently offline. Please try again later.`
      )
    }
  }
}

export default emergenceServerStatus
