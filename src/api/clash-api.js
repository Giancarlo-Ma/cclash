import { requestChunk, request } from './util'
const CONFIG_URL = '/configs'

export function requestTraffic(onReceive) {
  requestChunk('/traffic', 'GET', onReceive)
}

export async function requestClashConfigs() {
  return request(CONFIG_URL)
}