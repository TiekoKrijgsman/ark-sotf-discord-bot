import { bold, SlashCommandBuilder, underscore, userMention } from 'discord.js'

import { DiscordClient } from '../services/discord/DiscordClient.js'
import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import { pluralizeWord } from '../utils/pluralizeWord.js'

const LEADERBOARD_SIZE = 10

const invitationsLeaderboard: DiscordCommand = {
  data: new SlashCommandBuilder().setName('invitations-leaderboard').setDescription('Replies with the leaderboard of the members with the most invites.').toJSON(),
  execute: async (interaction) => {
    const discordClient = await DiscordClient.getInstance()
    const invitations = await interaction.guild?.invites.fetch()
    const usersInvitations = await discordClient.getUsersInvitations(invitations)
    const sortedInvitationsLeaderboard = Array.from(usersInvitations.values()).sort((a, b) => {
      return b.invitationsCount - a.invitationsCount
    })
    const leaderboard = sortedInvitationsLeaderboard.slice(0, LEADERBOARD_SIZE).map((userInvitations, index) => {
      return `${index + 1}. ${userMention(userInvitations.inviter.id)}: ${bold(userInvitations.invitationsCount.toString())} ${pluralizeWord('member', userInvitations.invitationsCount)} invited.`
    })
    await interaction.reply({
      content: `${underscore(bold(`Invitations Leaderboard - Top ${LEADERBOARD_SIZE}`))}\n\n${leaderboard.join('\n')}`,
      allowedMentions: {
        users: []
      }
    })
  }
}

export default invitationsLeaderboard
