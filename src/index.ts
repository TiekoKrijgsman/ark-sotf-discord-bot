import { DiscordClient } from './services/discord/DiscordClient.js'

const discordClient = await DiscordClient.getInstance()

await discordClient.loadEvents()
await discordClient.login()
