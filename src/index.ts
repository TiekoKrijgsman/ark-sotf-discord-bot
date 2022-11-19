import { discordClient } from './services/discord/DiscordClient.js'

await discordClient.loadEvents()
await discordClient.login()
