import type { CacheType, ChatInputCommandInteraction } from 'discord.js'
import { bold, GuildMember, SlashCommandBuilder, underscore, userMention } from 'discord.js'

import { DiscordClient } from '../services/discord/DiscordClient.js'
import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import { pluralizeWord } from '../utils/pluralizeWord.js'

const LEADERBOARD_SIZE = 10

export const invitationsLeaderboardReply = async (interaction: ChatInputCommandInteraction<CacheType>): Promise<string> => {
  if (interaction.member == null || !(interaction.member instanceof GuildMember)) {
    throw new Error('Member is null')
  }
  const discordClient = await DiscordClient.getInstance()
  const invitations = await interaction.guild?.invites.fetch()
  const usersInvitations = await discordClient.getUsersInvitations(invitations)
  const sortedInvitationsLeaderboard = Array.from(usersInvitations.values()).sort((a, b) => {
    return b.invitationsCount - a.invitationsCount
  })
  const leaderboard = sortedInvitationsLeaderboard.slice(0, LEADERBOARD_SIZE).map((userInvitations, index) => {
    return `${index + 1}. ${userMention(userInvitations.inviter.id)}: ${bold(userInvitations.invitationsCount.toString())} ${pluralizeWord('member', userInvitations.invitationsCount)} invited.`
  })
  return `${underscore(bold(`Invitations Leaderboard - Top ${LEADERBOARD_SIZE}`))}\n\n${leaderboard.join('\n')}`
}

const invitationsLeaderboard: DiscordCommand = {
  data: new SlashCommandBuilder().setName('invitations-leaderboard').setDescription('Replies with the leaderboard of the members with the most invites.').toJSON(),
  execute: async (interaction) => {
    await interaction.reply({
      content: await invitationsLeaderboardReply(interaction),
      allowedMentions: {
        users: []
      }
    })
  }
}

export default invitationsLeaderboard
