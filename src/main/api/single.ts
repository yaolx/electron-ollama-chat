import { app } from 'electron'

export function setSingleInstance(mainWindow) {
  // 请求获取实例锁，若成功则返回true，否则表示已存在打开的应用实例
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore()
        }
        mainWindow.show()
        mainWindow.center()
        mainWindow.focus()
      }
    })
  }
}
