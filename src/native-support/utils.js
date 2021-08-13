import { app } from 'electron'
import * as fs from 'fs'
import { promisify } from 'util'

export const copyFile = promisify(fs.copyFile)

export function getDataPath(escape = false) {
  const ret = app.getPath('userData')
  if (!escape) {
      return ret
  }
  return ret.replace(/ /g, '\\ ')
}

export function getAppPath() {
  if (!isElectronDebug()) {
      return process.resourcesPath
  }
  return app.getAppPath()
}

export function curry(fn, args) {
  if (args && args.length === fn.length + 1) {
      fn.apply(fn, args)
  }
  return function() {
      const argsInArray = Array.prototype.slice.call(arguments, 0)
      return curry(fn, argsInArray.concat(args))
  }
}

export function isElectronDebug() {
  return process.env.NODE_ENV === 'development'
}

export const mkDir = promisify(fs.mkdir)

export function isWindows() {
  return process.platform === 'win32'
}

export function isLinux() {
  return process.platform === 'linux'
}