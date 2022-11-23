import { GuildMember, SlashCommandBuilder, userMention, bold } from 'discord.js'

import { getYouTubeSubscriberCount } from '../services/google.js'
import { getTwitchFollowerCount } from '../services/twitch.js'
import {
  DISCORD_BLOCK_CONTENT_CREATOR_ROLE_ID,
  DISCORD_CONTENT_CREATOR_ROLE_ID
} from '../configuration.js'
import type { DiscordGetUserProfileResponse } from '../services/discord/DiscordClient.js'
import { discordAPI } from '../services/discord/DiscordClient.js'
import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import { LOCALE } from '../utils/formatNumberOrdinals.js'

const MINIMUM_CONTENT_CREATOR_ROLE = 500

const medias = [
  { name: 'YouTube', value: 'youtube' },
  { name: 'Twitch', value: 'twitch' }
] as const

type MediaName = typeof medias[number]['name']

const contentCreatorRole: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('content-creator-role')
    .setDescription(
      `Adds the Content Creator role to the user who executed the command.`
    )
    .addStringOption((option) => {
      return option
        .setName('media')
        .setDescription('The media you create content for.')
        .addChoices(...medias)
        .setRequired(true)
    })
    .toJSON(),
  execute: async (interaction) => {
    if (
      interaction.member === null ||
      !(interaction.member instanceof GuildMember)
    ) {
      throw new Error('Member is null')
    }
    if (interaction.member.roles.cache.has(DISCORD_CONTENT_CREATOR_ROLE_ID)) {
      await interaction.reply(
        `You already have the Content Creator role. :star_struck:`
      )
      return
    }
    if (
      interaction.member.roles.cache.has(DISCORD_BLOCK_CONTENT_CREATOR_ROLE_ID)
    ) {
      await interaction.reply(
        `You can't have the Content Creator role. Refer to a moderator for more information.`
      )
      return
    }
    const media = interaction.options.get('media')
    const mediaChoice = medias.find((mediasChoice) => {
      return mediasChoice.value === media?.value
    })
    if (mediaChoice == null) {
      throw new Error('Media invalid')
    }
    const { data } = await discordAPI.get<DiscordGetUserProfileResponse>(
      `/users/${interaction.user.id}/profile`
    )
    const account = data.connected_accounts.find((connectedAccount) => {
      return mediaChoice.value === connectedAccount.type
    })
    if (account == null) {
      await interaction.reply(
        `${userMention(interaction.user.id)} You need to connect your ${
          mediaChoice.name
        } account to your Discord account to use this command. See: <https://support.discord.com/hc/en-us/articles/8063233404823-Connections-Community-Members> for more information.`
      )
      return
    }
    let mediaName: MediaName = 'YouTube'
    let mediaURL = ''
    let fansCount = 0
    let fansType: 'subscribers' | 'followers' = 'subscribers'
    if (account.type === 'youtube') {
      mediaName = 'YouTube'
      mediaURL = `https://www.youtube.com/channel/${account.id}`
      fansCount = await getYouTubeSubscriberCount(account)
      fansType = 'subscribers'
    } else {
      mediaName = 'Twitch'
      mediaURL = `https://www.twitch.tv/${account.name}`
      fansCount = await getTwitchFollowerCount(account)
      fansType = 'followers'
    }
    const fansCountString = `You currently have ${bold(
      `${fansCount.toLocaleString(LOCALE)} ${fansType} on ${mediaName}`
    )}`
    if (fansCount < MINIMUM_CONTENT_CREATOR_ROLE) {
      await interaction.reply(
        `${userMention(
          interaction.user.id
        )} You need at least ${MINIMUM_CONTENT_CREATOR_ROLE} ${fansType} to use this command.\n${fansCountString}, you can make it. :muscle:\n${mediaURL}`
      )
      return
    }
    await interaction.member.roles.add(DISCORD_CONTENT_CREATOR_ROLE_ID)
    await interaction.reply(
      `${userMention(
        interaction.user.id
      )} You have been given the Content Creator role. :tada:\n${fansCountString}.\n${mediaURL}`
    )
  }
}

export default contentCreatorRole
