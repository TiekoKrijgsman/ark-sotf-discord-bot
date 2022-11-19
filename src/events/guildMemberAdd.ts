import { bold, Events, userMention } from 'discord.js'

import { discordClient } from '../services/discord/DiscordClient.js'
import {
  DISCORD_WELCOME_CHANNEL_ID,
  DISCORD_WELCOME_ROLE_ID
} from '../configuration.js'
import type { DiscordEvent } from '../services/discord/DiscordEvent.js'

const guildMemberAdd: DiscordEvent<Events.GuildMemberAdd> = {
  name: Events.GuildMemberAdd,
  execute: async (member) => {
    await member.roles.add(DISCORD_WELCOME_ROLE_ID)
    const channel = discordClient.channels.cache.get(DISCORD_WELCOME_CHANNEL_ID)
    if (channel != null && channel.isTextBased()) {
      await channel.send(
        `Hey ${userMention(member.user.id)}, welcome to the official ${bold(
          member.guild.name
        )} Discord server!`
      )
    }
  }
}

export default guildMemberAdd
