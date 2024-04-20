import * as path from 'path'

import 'reflect-metadata'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow } from 'electron'

import { aiInit } from './ai'
import { onToolbar, checkUpdate, AppTray, setSingleInstance, setOpenHandler, renderWebview, sqliteRequest } from './api'
import { LocalDB } from './db'
import { ioc } from './ioc'
let mainWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, '../../asset/logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
      nodeIntegrationInSubFrames: true,
      nodeIntegration: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  // 隐藏窗口
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// 允许不安全的https加载
app.commandLine.appendSwitch('--ignore-certificate-errors', 'true')
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  // 设置单实例窗口
  setSingleInstance(mainWindow)
  // custom api
  // 工具栏自定义
  onToolbar()
  // 版本更新
  checkUpdate(mainWindow)
  // 系统托盘，消息提醒
  AppTray.trayInit(mainWindow)
  // 打开窗口事件
  setOpenHandler(mainWindow.webContents)
  // sqliteRequest
  sqliteRequest()
  // LocalDB
  ioc.get(LocalDB).init()
  // ai初始化
  aiInit()

  // 有新窗口打开
  app.on('web-contents-created', (_event, webContents) => {
    // defaultSessionHandler(webContents)
    setOpenHandler(webContents)
  })
  // listenWebview
  renderWebview(mainWindow.webContents)
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
