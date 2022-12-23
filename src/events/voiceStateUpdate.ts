import type { VoiceChannel } from 'discord.js'
import { ChannelType, Events, GuildMember } from 'discord.js'

import { DISCORD_VOICE_LOBBY_CATEGORY_ID, DISCORD_VOICE_LOBBY_CHANNEL_ID } from '../configuration.js'
import type { DiscordEvent } from '../services/discord/DiscordEvent.js'

const deleteVoiceChannel = async (channel: VoiceChannel): Promise<void> => {
  if (channel.deletable) {
    try {
      await channel.delete()
    } catch {}
  }
}

const voiceStateUpdate: DiscordEvent<Events.VoiceStateUpdate> = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState, newState) => {
    if (newState.channelId === oldState.channelId) {
      return
    }

    if (newState.channelId === DISCORD_VOICE_LOBBY_CHANNEL_ID && newState.member instanceof GuildMember) {
      const channel = await newState.guild.channels.create({
        name: `${newState.member.displayName}'s Channel`,
        type: ChannelType.GuildVoice,
        parent: newState.channel?.parentId
      })
      await newState.member.voice.setChannel(channel.id)
      await channel.permissionOverwrites.set([
        {
          id: newState.member.id,
          allow: ['ManageChannels', 'MoveMembers']
        }
      ])
    }

    if (
      oldState.channelId !== DISCORD_VOICE_LOBBY_CHANNEL_ID &&
      oldState.channel?.parentId === DISCORD_VOICE_LOBBY_CATEGORY_ID &&
      oldState.channel?.type === ChannelType.GuildVoice &&
      oldState.channel?.members.size === 0
    ) {
      await deleteVoiceChannel(oldState.channel)
    }
  }
}

export default voiceStateUpdate
