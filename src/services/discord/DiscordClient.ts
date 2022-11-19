import fs from 'node:fs'

import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'

import type { DiscordEvent } from './DiscordEvent.js'
import type { DiscordCommand } from './DiscordCommand.js'
import {
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
  DISCORD_TOKEN
} from '../../configuration.js'

export const discordRest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)

class DiscordClient extends Client {
  private static instance: DiscordClient | null = null

  public static COMMANDS_URL = new URL('../../commands/', import.meta.url)
  public static EVENTS_URL = new URL('../../events/', import.meta.url)

  public commands: Collection<string, DiscordCommand> = new Collection()

  private constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
      ]
    })
    this.token = DISCORD_TOKEN
  }

  private async saveCommands(): Promise<void> {
    const commandsFiles = await fs.promises.readdir(DiscordClient.COMMANDS_URL)
    for (const commandFile of commandsFiles) {
      const { default: command } = await import(
        new URL(`./${commandFile}`, DiscordClient.COMMANDS_URL).href
      )
      this.commands.set(command.data.name, command)
    }
  }

  public static async getInstance(): Promise<DiscordClient> {
    if (DiscordClient.instance == null) {
      DiscordClient.instance = new DiscordClient()
      await DiscordClient.instance.saveCommands()
    }
    return DiscordClient.instance
  }

  public async loadEvents(): Promise<void> {
    const eventsFiles = await fs.promises.readdir(DiscordClient.EVENTS_URL)
    for (const eventFile of eventsFiles) {
      const { default: event } = (await import(
        new URL(`./${eventFile}`, DiscordClient.EVENTS_URL).href
      )) as { default: DiscordEvent }
      if (event.once ?? false) {
        this.once(event.name, event.execute)
      } else {
        this.on(event.name, event.execute)
      }
    }
  }

  public async registerCommands(): Promise<void> {
    await discordRest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      {
        body: this.commands.map((command) => {
          return command.data.toJSON()
        })
      }
    )
  }
}

export const discordClient = await DiscordClient.getInstance()
