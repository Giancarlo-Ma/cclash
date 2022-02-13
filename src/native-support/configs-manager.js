import * as fs from 'fs';
import path from 'path';
import { getDataPath, isElectronDebug, mkDir, getAppPath, copyFile } from './utils'

export async function initConfigsIfNeeded() {
  await _createVclashConfigsIfNeeded()
  createSubscriptionFileIfNeeded()
  await _createClashConfigsIfNeeded()
}

export function getConfigPath() {
  return path.join(getDataPath(), 'vclash-configs', 'configs.json')
}

function getDefaultClashConfig() {
  return path.join(getDataPath(), 'clash-configs', 'config.yaml')
}

export function getDefaultClashConfigPath() {
  console.log(getDataPath())
  return ''
  // /????
}

export function getInitialConfig() {
  return {
    controllerPort: '2390',
    secret: '',
    currentProfile: getDefaultClashConfig(),
    currentProxy: '',
    currentSelector: '',
    systemProxy: false,
    startWithSystem: false,
    launchMinimized: true,
    clashVersion: null
  }
}

export function saveConfig(config) {
  fs.writeFileSync(getConfigPath(), JSON.stringify(config))
}

export function getCurrentConfig() {
  const fileName = getConfigPath()
  let content = fs.readFileSync(fileName)
  if (content == null || content.length === 0) {
    content = JSON.stringify(getInitialConfig(), null, 4)
    fs.writeFileSync(fileName, content)
  }
  try {
    return JSON.parse(content)
  } catch (e) {
    return getInitialConfig()
  }
}

export function setHttpPort(httpPort) {
  saveConfig({
    ...getCurrentConfig(),
    httpPort
  })
}

export function setSocksPort(socksPort) {
  saveConfig({
    ...getCurrentConfig(),
    socksPort
  })
}

export function createSubscriptionFileIfNeeded() {
  const subscriptions = path.join(getDataPath(), 'vclash-configs', 'subscriptions.json')
  const exist = fs.existsSync(subscriptions)
  if (!exist) {
    if (isElectronDebug()) {
      console.log('Subscription file not exist, creating...')
    }
    fs.writeFileSync(subscriptions, '{"subscriptions" : []}')
    if (isElectronDebug()) {
      console.log('Created subscription file.')
    }
  }
}

// 创造vclash-configs文件夹和configs.json文件
async function _createVclashConfigsIfNeeded() {
  const vclashConfigs = path.join(getDataPath(), 'vclash-configs')
  let exist = fs.existsSync(vclashConfigs)
  if (!exist) {
    if (isElectronDebug()) {
      console.log('vclash configs not exist, creating...')
    }
    await mkDir(vclashConfigs)
  }
  const vclashConfigFile = path.join(getDataPath(), 'vclash-configs', 'configs.json')
  exist = fs.existsSync(vclashConfigFile)
  if (!exist) {
    fs.writeFileSync(vclashConfigFile, '')
    if (isElectronDebug()) {
      console.log('Created vclash configs.')
    }
  }
}

async function _createClashConfigsIfNeeded() {
  const clashConfigPath = path.join(getDataPath(), 'clash-configs')
  const exist = fs.existsSync(clashConfigPath)
  if (!exist) {
    if (isElectronDebug()) {
      console.log('Clash configs not exist, creating...')
    }
    await mkDir(clashConfigPath)
    const defaultConfig = path.resolve('./', 'clash-configs', 'config.yaml')
    await copyFile(defaultConfig, path.resolve(clashConfigPath, 'config.yaml'))
    const mmdb = path.resolve('./', 'clash-configs', 'Country.mmdb')
    await copyFile(mmdb, path.resolve(clashConfigPath, 'Country.mmdb'))
    if (isElectronDebug()) {
      console.log('Clash configs & mmdb created.')
    }
    saveConfig({
      ...getCurrentConfig(),
      clashVersion: '1.0.0'
    })
    return
  }
}

export function switchProfile(e, profile) {
  console.log(profile)
  if (profile == null || profile.length === 0) {
    profile = getDefaultClashConfig()
  }
  saveConfig({
    ...getCurrentConfig(),
    currentProfile: profile
  })
}

export function switchProxy(e, { selector, proxy }) {
  saveConfig({
    ...getCurrentConfig(),
    currentProxy: proxy || '',
    currentSelector: selector || ''
  })
}