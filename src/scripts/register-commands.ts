import { DiscordClient } from '../services/discord/DiscordClient.js'

const discordClient = await DiscordClient.getInstance()

await discordClient.registerCommands()
console.log('Successfully reloaded application (/) commands.')
