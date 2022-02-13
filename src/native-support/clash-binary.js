import path from 'path'
import { exec } from 'child_process';
import * as fs from 'fs';

import { isElectronDebug, getDataPath, isWindows,  } from './utils';
import {switchToCurrentProfile } from './profiles-manager'

let clashProcess = null;

export function getClashBinaryPath() {
  let platform = ''
  let ret = 'clash-'
  let arch = ''
  switch (process.platform) {
    case 'linux':
      platform = 'linux-'
      break
    case 'win32':
      platform = 'windows-'
      break
    case 'darwin':
      platform = 'darwin-'
      arch = 'amd64'
      break
    default:
      break
  }
  if (process.platform !== 'darwin') {
    if (process.arch === 'x64') {
      arch = 'amd64'
    } else {
      arch = '386'
    }
  }
  ret = ret + platform + arch
  ret = path.resolve(path.join(!isElectronDebug() ? process.resourcesPath : '.', 'clash-binary', ret))
  if (isElectronDebug()) {
    console.log('Clash binary path = ' + ret)
  }
  return ret
}

export function spawnClash(configName) {
  if (clashProcess != null && !clashProcess.killed) {
    return
  }
  const clashPath = getClashBinaryPath()
  if (!isWindows()) {
    try {
      fs.accessSync(clashPath, fs.constants.X_OK)
    } catch (e) {
      fs.chmodSync(clashPath, 0o755)
    }
  }
  let cmd = clashPath + ' -d ' + path.join(getDataPath(true), 'clash-configs')
  // if (configName != null && configName.length !== 0) {
  //   cmd += '-c ' + configName
  // }
  if (isElectronDebug()) {
    console.log('Spawn cmd = ' + cmd)
  }
  clashProcess = exec(cmd, { detached: true })
  setTimeout(() => {
    switchToCurrentProfile()
  }, 500)
}

export function killClash() {
  if (clashProcess) {
      if (isWindows()) {
          spawnSync("taskkill", ["/pid", clashProcess.pid, '/f', '/t'])
      } else if (clashProcess.kill) {
          clashProcess.kill('SIGINT')
      } else if (clashProcess.pid) {
          process.kill(clashProcess.pid, 'SIGINT')
      }
      clashProcess = null
  }
}