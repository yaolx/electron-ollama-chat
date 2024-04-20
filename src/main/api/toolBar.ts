import { ipcMain, BrowserWindow } from 'electron'

export function onToolbar() {
  ipcMain.on('toolbar', (event, val) => {
    /**
     * 通过BrowserWindow.fromWebContents方法拿到window实例
     * event.sender 是发送消息的WebContents实例
     */
    const window: Electron.BrowserWindow | null = BrowserWindow.fromWebContents(event.sender)
    switch (val) {
      case 'mini': // 最小化窗口
        window?.minimize()
        break
      case 'close': // 关闭窗口
        window?.hide()
        break
      case 'big': // 全屏/取消全屏
        window?.isMaximized() ? window?.unmaximize() : window?.maximize()
        break
      case 'devTool': // 打开控制台
        event.sender?.openDevTools()
        break
      default:
        break
    }
  })
}
