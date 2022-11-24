import type { CacheType, ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js'

export interface DiscordCommand {
  data: RESTPostAPIChatInputApplicationCommandsJSONBody
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
}
