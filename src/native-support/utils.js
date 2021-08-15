import { app } from 'electron'
import * as fs from 'fs'
import { promisify } from 'util'
import http from 'http'
import https from 'https'

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
  return function () {
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

export function fetchHttps(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const req = https.request(url, options, resp => {
      let data = ''
      resp.on('error', e => reject(e))
      resp.on('data', chunk => { data += chunk })
      resp.on('end', () => resolve(data))
    }).on('error', err => reject(err))
    req.end()
  })
}

export function fetchHttp(url, method, params) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(params || {})
    const options = {
      method: method == null || method.length === 0 ? 'GET' : method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const req = http.request(url, options, resp => {
      let data = ''
      resp.on('error', e => reject(e))
      resp.on('data', chunk => { data += chunk })
      resp.on('end', () => resolve(data))
    }).on('error', err => reject(err))
    req.write(data)
    req.end()
  })
}

export function writeStream(stream, content) {
  return new Promise((resolve) => {
      stream.write(content, () => {
          resolve()
      })
  })
}