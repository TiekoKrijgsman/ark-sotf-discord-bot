import axios from 'axios'

/**
 * Documentation: <https://partner.steamgames.com/doc/webapi>
 */
export const steamAPI = axios.create({
  baseURL: 'https://api.steampowered.com/',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const SOTF_APP_ID = 407530

/**
 * /ISteamUserStats/GetNumberOfCurrentPlayers/v1/
 */
export interface SteamGetNumberOfCurrentPlayersResponse {
  response: {
    player_count: number
  }
}
