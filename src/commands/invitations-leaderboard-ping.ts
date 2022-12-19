import { PermissionsBitField, SlashCommandBuilder } from 'discord.js'

import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import { invitationsLeaderboardReply } from './invitations-leaderboard.js'

const invitationsLeaderboardPing: DiscordCommand = {
  data: new SlashCommandBuilder()
    .setName('invitations-leaderboard-ping')
    .setDescription('Replies with the leaderboard of the members with the most invites (with ping).')
    .setDMPermission(false)
    .setDefaultMemberPermissions(new PermissionsBitField('Administrator').valueOf())
    .toJSON(),
  execute: async (interaction) => {
    await interaction.reply({
      content: await invitationsLeaderboardReply(interaction)
    })
  }
}

export default invitationsLeaderboardPing
