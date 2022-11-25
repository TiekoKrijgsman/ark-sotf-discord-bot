import { fileURLToPath } from 'node:url'

import { bold, channelMention, Events, userMention } from 'discord.js'

import { DISCORD_RULES_CHANNEL_ID, DISCORD_WELCOME_CHANNEL_ID } from '../configuration.js'
import type { DiscordEvent } from '../services/discord/DiscordEvent.js'
import { formatNumberOrdinals } from '../utils/formatNumberOrdinals.js'
import { DiscordClient } from '../services/discord/DiscordClient.js'

const guildMemberAdd: DiscordEvent<Events.GuildMemberAdd> = {
  name: Events.GuildMemberAdd,
  execute: async (member) => {
    const discordClient = await DiscordClient.getInstance()
    const channel = discordClient.channels.cache.get(DISCORD_WELCOME_CHANNEL_ID)
    if (channel != null && channel.isTextBased()) {
      const content = `Welcome to the ${bold(member.guild.name)} Discord server! ${userMention(member.user.id)}
You are the ${bold(formatNumberOrdinals(member.guild.memberCount))} member! :star_struck:
Please read and accept the ${channelMention(DISCORD_RULES_CHANNEL_ID)} and most importantly, have fun!`
      await channel.send({
        content,
        files: [
          {
            attachment: fileURLToPath(new URL('../../public/SOTFBanner.jpg', import.meta.url))
          }
        ]
      })
    }
  }
}

export default guildMemberAdd
