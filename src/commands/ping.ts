import { SlashCommandBuilder } from 'discord.js'

import type { DiscordCommand } from '../services/discord/DiscordCommand.js'

const ping: DiscordCommand = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!').toJSON(),
  execute: async (interaction) => {
    const latency = Math.round(interaction.client.ws.ping)
    await interaction.reply(`:ping_pong: Pong! Latency is ${latency}ms.`)
  }
}

export default ping
