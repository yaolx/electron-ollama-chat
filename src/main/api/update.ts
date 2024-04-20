import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

export function checkUpdate(mainWindow) {
  // 主进程跟渲染进程通信
  const sendUpdateMessage = (msg) => {
    // 发送消息给渲染进程
    mainWindow.webContents.send('update_message', msg)
  }
  // 检测下载错误
  autoUpdater.on('error', (err) => {
    sendUpdateMessage({
      cmd: 'error',
      message: err
    })
  })
  // 检测是否需要更新
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage({
      cmd: 'checking-for-update',
      message: 'start-check'
    })
  })
  // 检测到不需要更新时
  autoUpdater.on('update-not-available', (message) => {
    // 这里可以做静默处理，不给渲染进程发通知，或者通知渲染进程当前已是最新版本，不需要更新
    sendUpdateMessage({
      cmd: 'update-not-available',
      message
    })
  })

  // 检测到可以更新时
  autoUpdater.on('update-available', (message) => {
    sendUpdateMessage({
      cmd: 'update-available',
      message
    })
  })
  // 更新下载进度
  autoUpdater.on('download-progress', (message) => {
    // 直接把当前的下载进度发送给渲染进程即可，有渲染层自己选择如何做展示
    sendUpdateMessage({
      cmd: 'download-progress',
      message
    })
  })

  // 当需要更新的内容下载完成后
  autoUpdater.on('update-downloaded', (message) => {
    sendUpdateMessage({
      cmd: 'update-downloaded',
      message
    })
  })
  // 监听渲染进程消息，开始检查更新
  ipcMain.on('checkForUpdate', () => {
    autoUpdater.checkForUpdates()
  })
  // 监听渲染进程消息，立即退出安装
  ipcMain.on('quitAndInstall', () => {
    autoUpdater.quitAndInstall()
  })
  // 获取版本号
  ipcMain.handle('getAppVersion', () => {
    return app.getVersion()
  })
}
