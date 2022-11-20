import dotenv from 'dotenv'

dotenv.config()

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? 'clientId'
export const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID ?? '101010101'
export const DISCORD_RULES_CHANNEL_ID =
  process.env.DISCORD_RULES_CHANNEL_ID ?? '101010101'
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? 'token'
export const DISCORD_WELCOME_CHANNEL_ID =
  process.env.DISCORD_WELCOME_CHANNEL_ID ?? '101010101'
export const DISCORD_WELCOME_ROLE_ID =
  process.env.DISCORD_WELCOME_ROLE_ID ?? '101010101'

export const NITRADO_SERVER_ADMIN_PASSWORD =
  process.env.NITRADO_SERVER_ADMIN_PASSWORD ?? 'password'
export const NITRADO_SERVER_IP =
  process.env.NITRADO_SERVER_IP ?? '127.127.127.127'
export const NITRADO_SERVER_RCON_PORT = parseInt(
  process.env.NITRADO_SERVER_RCON_PORT ?? '25315',
  10
)
export const NITRADO_TOKEN = process.env.NITRADO_TOKEN ?? 'token'
export const NITRADO_BEGINNERS_GAMESERVER_ID = 11536061
