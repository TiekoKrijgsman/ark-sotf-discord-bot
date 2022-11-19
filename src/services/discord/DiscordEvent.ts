import type { ClientEvents, Events } from 'discord.js'

export interface DiscordEvent<
  K extends keyof ClientEvents = Events.ClientReady
> {
  name: K
  once?: boolean
  execute: (..._arguments: ClientEvents[K]) => Promise<void>
}
