import axios from 'axios'

import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '../configuration.js'
import type { ConnectedAccount } from './discord/DiscordClient.js'

/**
 * Documentation: <https://partner.steamgames.com/doc/webapi>
 */
export const twitchAPI = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const twitchOAuthAPI = axios.create({
  baseURL: 'https://id.twitch.tv/oauth2/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

/**
 * /users/follows
 */
export interface TwitchGetUsersFollowsResponse {
  total: number
}

/**
 * /token
 */
export interface TwitchCredentials {
  access_token: string
  expires_in: number
  token_type: 'bearer'
}

export interface TwitchCredendialsExtended extends TwitchCredentials {
  access_token_age: number
}

let credentials: TwitchCredendialsExtended | null = null

export const getTwitchFollowerCount = async (
  account: ConnectedAccount
): Promise<number> => {
  const isValidCredentials =
    credentials !== null &&
    credentials.access_token_age + credentials.expires_in > Date.now()
  if (credentials == null || !isValidCredentials) {
    const parameters = new URLSearchParams()
    parameters.append('client_id', TWITCH_CLIENT_ID)
    parameters.append('client_secret', TWITCH_CLIENT_SECRET)
    parameters.append('grant_type', 'client_credentials')
    const { data: twitchCredentials } =
      await twitchOAuthAPI.post<TwitchCredentials>('/token', parameters)
    credentials = {
      ...twitchCredentials,
      access_token_age: Date.now()
    }
  }
  const { data: twitchData } =
    await twitchAPI.get<TwitchGetUsersFollowsResponse>('/users/follows', {
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Client-ID': TWITCH_CLIENT_ID
      },
      params: {
        to_id: account.id,
        first: 1
      }
    })
  const followerCount = twitchData.total
  return followerCount
}
