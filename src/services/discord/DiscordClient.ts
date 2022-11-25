import fs from 'node:fs'

import axios from 'axios'
import type { Invite, User } from 'discord.js'
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js'

import type { DiscordEvent } from './DiscordEvent.js'
import type { DiscordCommand } from './DiscordCommand.js'
import { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_TOKEN, DISCORD_TOKEN_USER } from '../../configuration.js'

const DISCORD_API_VERSION = '10'

export const discordAPI = axios.create({
  baseURL: `https://discord.com/api/v${DISCORD_API_VERSION}/`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: DISCORD_TOKEN_USER
  }
})

export const discordRest = new REST({ version: DISCORD_API_VERSION }).setToken(DISCORD_TOKEN)

export class DiscordClient extends Client {
  private static instance: DiscordClient | null = null

  public static COMMANDS_URL = new URL('../../commands/', import.meta.url)
  public static EVENTS_URL = new URL('../../events/', import.meta.url)

  public commands: Collection<string, DiscordCommand> = new Collection()

  private constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
    })
    this.token = DISCORD_TOKEN
  }

  private async saveCommands(): Promise<void> {
    const commandsFiles = await fs.promises.readdir(DiscordClient.COMMANDS_URL)
    for (const commandFile of commandsFiles) {
      const { default: command } = await import(new URL(`./${commandFile}`, DiscordClient.COMMANDS_URL).href)
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
      const { default: event } = (await import(new URL(`./${eventFile}`, DiscordClient.EVENTS_URL).href)) as { default: DiscordEvent }
      if (event.once ?? false) {
        this.once(event.name, event.execute)
      } else {
        this.on(event.name, event.execute)
      }
    }
  }

  public async registerCommands(): Promise<void> {
    await discordRest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
      body: this.commands.map((command) => {
        return command.data
      })
    })
  }

  /**
   *
   * @param invitations
   * @returns
   */
  public async getUsersInvitations(invitations?: Collection<string, Invite>): Promise<UsersInvitations> {
    if (invitations == null) {
      throw new Error('Failed to fetch invitations')
    }
    const usersInvitations: UsersInvitations = new Map()
    for (const invitation of invitations.values()) {
      if (invitation.inviter == null) {
        continue
      }
      const userInvitations = usersInvitations.get(invitation.inviter.id)
      if (userInvitations == null) {
        usersInvitations.set(invitation.inviter.id, {
          invitationsCount: invitation.uses ?? 0,
          inviter: invitation.inviter
        })
      } else {
        userInvitations.invitationsCount += invitation.uses ?? 0
      }
    }
    return usersInvitations
  }
}

/**
 * Key: User Id
 *
 * Value: Number of invitations
 */
export type UsersInvitations = Map<string, UserInvitations>

export interface UserInvitations {
  invitationsCount: number
  inviter: User
}

export interface ConnectedAccount {
  type: 'github' | 'steam' | 'twitch' | 'twitter' | 'youtube'
  id: string
  name: string
  verified: boolean
}

/**
 * /users/{id}/profile
 */
export interface DiscordGetUserProfileResponse {
  connected_accounts: ConnectedAccount[]
}
