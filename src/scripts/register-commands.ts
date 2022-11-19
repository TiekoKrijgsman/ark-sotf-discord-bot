import { discordClient } from '../services/discord/DiscordClient.js'

await discordClient.registerCommands()
console.log('Successfully reloaded application (/) commands.')
