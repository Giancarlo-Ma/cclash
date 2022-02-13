import { ipcRenderer, contextBridge } from 'electron'
import { ADD_PROFILE, FETCH_PROFILES, SWITCH_PROFILE, DELETE_PROFILE, RELOAD_PROFILE, SWITCH_PROXY, GET_VCLASH_CONFIG } from './native-support/message-constant'

contextBridge.exposeInMainWorld('electronAPI', {
  fetchProfiles: () => ipcRenderer.invoke(FETCH_PROFILES),
  switchProfile: (profile) => ipcRenderer.invoke(SWITCH_PROFILE, profile),
  addProfile: (url) => ipcRenderer.invoke(ADD_PROFILE, url),
  deleteProfile: (profileUrl) => ipcRenderer.invoke(DELETE_PROFILE, profileUrl),
  reloadProfile: (profileUrl) => ipcRenderer.invoke(RELOAD_PROFILE, profileUrl),
  switchProxy: ({ selector, proxy }) => ipcRenderer.invoke(SWITCH_PROXY, { selector, proxy }),
  getVclashConfig: () => ipcRenderer.invoke(GET_VCLASH_CONFIG)
})
