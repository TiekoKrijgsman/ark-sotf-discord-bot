import { bold, SlashCommandBuilder } from 'discord.js'

import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import type { SteamGetNumberOfCurrentPlayersResponse } from '../services/steam.js'
import { SOTF_APP_ID, steamAPI } from '../services/steam.js'
import { LOCALE } from '../utils/formatNumberOrdinals.js'

const steamSOTFCurrentPlayersCount: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('steam-sotf-current-players-count')
    .setDescription(
      'Replies with the current number of players on Steam on ARK: SOTF.'
    )
    .toJSON(),
  execute: async (interaction) => {
    const { data } = await steamAPI.get<SteamGetNumberOfCurrentPlayersResponse>(
      '/ISteamUserStats/GetNumberOfCurrentPlayers/v1/',
      {
        params: {
          appid: SOTF_APP_ID
        }
      }
    )
    await interaction.reply(
      `Currently, the number of players on Steam on ARK: SOTF is ${bold(
        data.response.player_count.toLocaleString(LOCALE)
      )}.\nhttps://steamcharts.com/app/${SOTF_APP_ID}`
    )
  }
}

export default steamSOTFCurrentPlayersCount
