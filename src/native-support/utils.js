import { app } from 'electron'
import * as fs from 'fs'
import { promisify } from 'util'
import http from 'http'
import https from 'https'
import { basename } from 'path'
import { URL } from 'url'

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

const TIMEOUT = 10000

export function download (url, dest) {
  const uri = new URL(url)
  const pkg = url.toLowerCase().startsWith('https:') ? https : http

  return new Promise((resolve, reject) => {
    const request = pkg.get(uri.href).on('response', (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest, { flags: 'wx' })
        res
          .on('end', () => {
            file.end()
            // console.log(`${uri.pathname} downloaded to: ${path}`)
            resolve()
          })
          .on('error', (err) => {
            file.destroy()
            fs.unlink(dest, () => reject(err))
          }).pipe(file)
      } else if (res.statusCode === 302 || res.statusCode === 301) {
        // Recursively follow redirects, only a 200 will resolve.
        download(res.headers.location, dest).then(() => resolve())
      } else {
        reject(new Error(`Download request failed, response status: ${res.statusCode} ${res.statusMessage}`))
      }
    })
    request.setTimeout(TIMEOUT, function () {
      request.destroy()
      reject(new Error(`Request timeout after ${TIMEOUT / 1000.0}s`))
    })
  })
}
