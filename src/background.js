'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import IPCCalls from './native-support/ipc-calls'
import { curry } from './native-support/utils'
import  { BRG_MSG_GET_CLASHY_CONFIG } from './native-support/message-constant'
import { getCurrentConfig, initConfigsIfNeeded } from './native-support/configs-manager'
import * as path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  })
  win.setFullScreenable(false)
  win.setResizable(false)
  win.removeMenu()
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  initConfigsIfNeeded().then(() => {
      // ClashBinary.spawnClash()
      console.log('succeesss')
  }).catch(e => {
      console.error(e)
  })

  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('IPC_MESSAGE_QUEUE', (event, args) => {
  resolveIPCCall(args, args.__callbackId, getCurrentConfig())
})

function dispatchIPCCalls(event) {
  switch (event.__name) {
    case BRG_MSG_GET_CLASHY_CONFIG:
      resolveIPCCall(event, event.__callbackId, getCurrentConfig())
      break
    default: {
      const call = IPCCalls[event.__name]
      const resolve = curry(resolveIPCCall)(event)(event.__callbackId)
      const reject = curry(rejectIPCCall)(event)(event.__callbackId)
      if (call) {
        call(event).then(resolve).catch(reject)
      }
      break
    }
  }
}

function resolveIPCCall(event, callbackId, result) {
  if (win == null) {
    return
  }
  win.webContents.send('IPC_MESSAGE_QUEUE', {
    __callbackId: callbackId,
    event,
    value: result
  })
}

function rejectIPCCall(event, callbackId, error) {
  if (win == null) {
    return
  }
  win.webContents.send('IPC_MESSAGE_QUEUE_REJECT', {
    __callbackId: callbackId,
    event,
    value: error
  })
}