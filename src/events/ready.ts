import { Events } from 'discord.js'

import type { DiscordEvent } from '../services/discord/DiscordEvent.js'

const ready: DiscordEvent<Events.ClientReady> = {
  name: Events.ClientReady,
  once: true,
  execute: async (discordClient) => {
    if (discordClient.user == null) {
      return
    }
    await discordClient.user.setUsername('The Survival Of The Fittest Bot')
    console.log(`Logged in as \`${discordClient.user.tag}\`!`)
    console.log(
      `Invite link: <https://discord.com/oauth2/authorize?client_id=${discordClient.user.id}&permissions=8&scope=bot>`
    )
  }
}

export default ready
