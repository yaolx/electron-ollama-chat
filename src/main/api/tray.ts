import { Tray, ipcMain, Menu, nativeImage } from 'electron'

import { getAssetPath } from '../utils'
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
/**
 * 多次执行task，最大尝试次数10，中途可以调用stop阻止
 */
function withMultiTime(task, timesLimit = 10) {
  let currentTime = 0
  let stopResolve
  let hasDone = false
  const run = async (...args) => {
    // 已经请求停止，如果还没执行则立刻返回
    if (stopResolve) {
      stopResolve()
    } else if (currentTime < timesLimit) {
      await task(...args)
      // 已经请求停止，如果还没执行则立刻返回
      if (stopResolve) {
        stopResolve()
        hasDone = true
      } else {
        currentTime += 1
        setTimeout(() => {
          run(...args)
        })
      }
    } else {
      hasDone = true
    }
  }
  const stop = async () => {
    if (!hasDone) {
      const p = new Promise((resolve) => {
        stopResolve = resolve
      })
      return p
    }
  }
  return {
    run,
    stop
  }
}

const maxBlinkCount = 10
const defaultIcon = getAssetPath('./logo.ico')
export const AppTray = {
  tray: {} as Electron.Tray,
  stopPreviousBink: () => {},
  trayInit(win) {
    const trayContextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          win.show()
          win.center()
          win.focus()
        }
      },
      {
        label: '退出',
        role: 'quit'
      }
    ])
    // 设置托盘
    this.tray = new Tray(defaultIcon)
    // 设置hover后的信息
    ipcMain.on('songPlay', async (_e, data) => {
      this.tray.setToolTip(data)
    })
    // 设置鼠标左键事件
    this.tray.on('click', () => {
      win.show()
    })
    // 设置鼠标右键键事件
    this.tray.on('right-click', () => {
      this.tray.popUpContextMenu(trayContextMenu)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ipcMain.handle('notice_tip', async (_e, args) => {
      const { title, content, type } = args
      if (content) {
        this.tray.displayBalloon({
          title: title || '通知',
          content,
          iconType: type || 'none',
          largeIcon: false
        })
      }
      await AppTray.blinkTray()
    })
  },
  async blinkTray() {
    await AppTray.stopPreviousBink()
    const { run, stop } = withMultiTime(AppTray.singleTrayBlink, maxBlinkCount)
    AppTray.stopPreviousBink = stop
    run()
  },
  async singleTrayBlink() {
    AppTray.tray.setImage(nativeImage.createEmpty())
    await sleep(500)
    AppTray.tray.setImage(defaultIcon)
    await sleep(500)
  }
}
