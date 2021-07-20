import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronIPC', {
  on (eventName, callback) {
    ipcRenderer.on(eventName, callback)
  },
  send (channel, data) {
    ipcRenderer.send(channel, data)
  }
})
