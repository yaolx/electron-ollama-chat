import { contextBridge, ipcRenderer } from 'electron'
// Custom APIs for renderer
const api = {
  mainView: {
    // 最小化，放大，关闭事件
    onToolbar: (val) => {
      ipcRenderer.send('toolbar', val)
    },
    // 播放音乐，传歌曲名称，消息提醒
    onPlay: (val) => {
      ipcRenderer.send('songPlay', val)
    },
    // 发送通知
    onSendNotice: (val) => ipcRenderer.invoke('notice_tip', val),
    // 打开文件夹
    openDirectory: (val) => ipcRenderer.send('openFolder', val),
    getFiles: (val) => ipcRenderer.invoke('getFiles', val),
    // preloadjs
    getPreloadFile: () => ipcRenderer.sendSync('get-preloadFile-path'),
    sqliteRequest: (val) => ipcRenderer.invoke('sqlite-request', val),
    startReptile: (val) => ipcRenderer.invoke('start_reptile', val),
    getConfig: (val) => ipcRenderer.invoke('get_config', val)
  },
  aiApi: {
    sendChat: (val) => ipcRenderer.send('chat:send', val),
    onChatReply: (func) => {
      ipcRenderer.on('chat:reply', (_event, ...args) => func(...args))
    }
  },
  webView: {
    // 抽屉式弹窗
    openInPopup({ url, ...rest }) {
      const feature = [
        'forcePopup',
        ...Object.keys(rest)
          .filter((key) => rest[key] !== false)
          .map((key) => `${key}=${encodeURIComponent(rest[key])}`)
      ]
      window.open(url, '_blank', feature.join(','))
    },
    // 打开弹窗
    onNewPopup: (func) => {
      ipcRenderer.on('new-popup', (_event, ...args) => func(...args))
    }
  },
  appUpdater: {
    // 检查更新
    checkUpdate: () => {
      ipcRenderer.send('checkForUpdate')
    },
    // 退出安装
    quitAndInstall: () => {
      ipcRenderer.send('quitAndInstall')
    },
    // 版本更新信息
    updateProgress: (func) => {
      ipcRenderer.on('update_message', (_event, ...args) => func(...args))
    },
    // 获取版本信息
    getAppVersion: () => ipcRenderer.invoke('getAppVersion')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('xElectron', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.xElectron = api
}
