import { requestChunk, request } from './util'
const CONFIG_URL = '/configs'
const PROXIES_URL = '/proxies'

export function requestTraffic(onReceive) {
  requestChunk('/traffic', 'GET', onReceive)
}

export async function requestClashConfigs() {
  return request(CONFIG_URL)
}

export async function requestSaveClashConfigs(configs) {
  return request(`${CONFIG_URL}`, 'PATCH', {}, { ...configs })
}

export async function requestSwitchConfigs(path) {
  console.log(path)
  // 强制改变端口
  return request(`${CONFIG_URL}?force=true`, 'PUT', {}, { path })
}

export async function requestClashProxies() {
  return request(PROXIES_URL)
}

export async function requestSwitchProxy(selector, proxy) {
  return request(`${PROXIES_URL}/${selector}`, 'PUT', {}, { name: proxy })
}