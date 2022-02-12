import { ipcRenderer, contextBridge } from 'electron'
import { ADD_PROFILE, FETCH_PROFILES, SWITCH_PROFILE, DELETE_PROFILE, RELOAD_PROFILE} from './native-support/message-constant'


contextBridge.exposeInMainWorld('electronIPC', {
  on (eventName, callback) {
    ipcRenderer.on(eventName, callback)
  },
  send (channel, data) {
    ipcRenderer.send(channel, data)
  },
  
})

contextBridge.exposeInMainWorld('electronAPI', {
  fetchProfiles: () => ipcRenderer.invoke(FETCH_PROFILES),
  switchProfile: (profile) => ipcRenderer.invoke(SWITCH_PROFILE, profile),
  addProfile: (url) => ipcRenderer.invoke(ADD_PROFILE, url),
  deleteProfile: (profileUrl) => ipcRenderer.invoke(DELETE_PROFILE, profileUrl),
  reloadProfile: (profileUrl) => ipcRenderer.invoke(RELOAD_PROFILE, profileUrl),
})
