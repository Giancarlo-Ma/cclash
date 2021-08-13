import { promisify } from 'util'
import { readdir } from 'fs'
import path from 'path'

import { getDataPath } from './utils'
import { getCurrentConfig } from './configs-manager'


const readDir = promisify(readdir)

export function fetchProfiles() {
  const folderName = path.resolve(getDataPath(), 'clash-configs')
  return readDir(folderName).then(folderContents => {
      const profiles = folderContents
          .filter(each => each.endsWith('.yaml') || each.endsWith('yml'))
          .map(each => {
              const fullPath = path.resolve(path.join(folderName, each))
              return {
                  name: each,
                  url: fullPath,
              }
          })
      const { currentProfile } = getCurrentConfig()
      return {
          profiles,
          currentProfile
      }
  })
}