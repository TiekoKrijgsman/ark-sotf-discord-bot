import axios from 'axios'

import { NITRADO_TOKEN } from '../configuration.js'

/**
 * Documentation: <https://doc.nitrado.net/>
 */
export const nitradoAPI = axios.create({
  baseURL: 'https://api.nitrado.net/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${NITRADO_TOKEN}`
  }
})

export interface NitradoResponse<T> {
  status: 'success'
  data: T
}

export interface NitradoGameServer {
  gameserver: {
    status: 'started'
    ip: string
    port: number
    query_port: number
    game: 'arksotf'
    game_name: 'ARK: Survival of the Fittest'
    slots: number
    settings: {
      config: {
        ['message-of-the-day']: string
        ['ban-list']: string
        ['admin-list']: string
      }
      general: {}
    }
    query: {
      ['server_name']: string | `[In-Match] ${string}`
      ['connect_ip']: string
      map: string
      version: string
      ['player_current']: number
      ['player_max']: number
      players: Array<{
        name: string
      }>
    }
  }
}
