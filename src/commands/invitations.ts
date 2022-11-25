import { SlashCommandBuilder, userMention, bold } from 'discord.js'

import { DiscordClient } from '../services/discord/DiscordClient.js'
import type { DiscordCommand } from '../services/discord/DiscordCommand.js'
import { pluralizeWord } from '../utils/pluralizeWord.js'

const invitations: DiscordCommand = {
  data: new SlashCommandBuilder().setName('invitations').setDescription('Replies with the number of invitations made by the user who executed the command.').toJSON(),
  execute: async (interaction) => {
    if (interaction.member == null) {
      throw new Error('Member is null')
    }
    const discordClient = await DiscordClient.getInstance()
    const invitations = await interaction.guild?.invites.fetch()
    const usersInvitations = await discordClient.getUsersInvitations(invitations)
    const userInvitations = usersInvitations.get(interaction.member.user.id)
    const invitationsCount = userInvitations?.invitationsCount ?? 0
    await interaction.reply({
      content: `${userMention(interaction.user.id)} You invited ${bold(invitationsCount.toString())} ${pluralizeWord('member', invitationsCount)}.`
    })
  }
}

export default invitations
