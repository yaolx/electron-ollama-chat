import * as path from 'path'

import { ipcMain, globalShortcut } from 'electron'

const preloadFilePath = path.join(__dirname, '../preload/index.js')
export function renderWebview(webContents) {
  // 获取版本号
  ipcMain.on('get-preloadFile-path', (event) => {
    event.returnValue = preloadFilePath
  })
  // 界面放大缩小

  let level = 0

  // 注册一个 'CommandOrControl+X' 的全局快捷键
  globalShortcut.register('CommandOrControl+num9', () => {
    level = 0
    webContents.setZoomLevel(0)
  })

  webContents.on('zoom-changed', (_e, zoomDirection) => {
    if (zoomDirection === 'in') {
      level = level >= 3 ? level : (level += 0.2)
    } else {
      level = level <= -3 ? level : (level -= 0.2)
    }
    webContents.setZoomLevel(level)
  })

  ipcMain.handle('get-image-data', (_e, args) => {
    const { imgUrl } = args
    const buffer = Buffer.from(imgUrl, 'base64')
    return buffer
  })
}
