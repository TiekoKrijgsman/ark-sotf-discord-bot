import type {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js'

export interface DiscordCommand {
  data: SlashCommandBuilder
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>
}
