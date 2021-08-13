import * as fs from 'fs';
import path from 'path';
import { getDataPath, isElectronDebug, mkDir, getAppPath, copyFile } from './utils'

export async function initConfigsIfNeeded() {
  await _createClashyConfigsIfNeeded()
  // await createSubscriptionFileIfNeeded()
  await _createClashConfigsIfNeeded()
}

export function getConfigPath() {
  return path.join(getDataPath(), 'clashy-configs', 'configs.json')
}

export function getDefaultClashConfig() {
  return path.join(getDataPath(), 'clash-configs', 'config.yaml')
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

// async function createSubscriptionFileIfNeeded() {
//   const subscriptions = path.join(getDataPath(), 'clashy-configs', 'subscriptions.json')
//   const exist = fs.existsSync(subscriptions)
//   if (!exist) {
//       if (isElectronDebug()) {
//           console.log('Subscription file not exist, creating...')
//       }
//       let fd = fs.openSync(subscriptions, 'w+')
//       fs.closeSync(fd)
//       fs.writeFileSync(subscriptions, '{"subscriptions" : []}')
//       if (isElectronDebug()) {
//           console.log('Created subscription file.')
//       }
//   }
// }

async function _createClashyConfigsIfNeeded() {
  const clashyConfigs = path.join(getDataPath(), 'clashy-configs')
  let exist = fs.existsSync(clashyConfigs)
  if (!exist) {
    if (isElectronDebug()) {
      console.log('Clashy configs not exist, creating...')
    }
    await mkDir(clashyConfigs)
  }
  const clashyConfigFile = path.join(getDataPath(), 'clashy-configs', 'configs.json')
  exist = fs.existsSync(clashyConfigFile)
  if (!exist) {
    // let fd = fs.openSync(clashyConfigFile, 'w+')
    // fs.closeSync(fd)
    fs.writeFileSync(clashyConfigFile, '')
    if (isElectronDebug()) {
      console.log('Created Clashy configs.')
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
    const defaultConfig = path.resolve(getAppPath(), 'clash-configs', 'config.yaml')
    await copyFile(defaultConfig, path.resolve(clashConfigPath, 'config.yaml'))
    const mmdb = path.resolve(getAppPath(), 'clash-configs', 'Country.mmdb')
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