import { ElectronAPI } from '@electron-toolkit/preload'
declare global {
  interface Window {
    electron: ElectronAPI
    xElectron: {
      mainView: {
        onToolbar: (val: T) => void
        onPlay: (val: T) => void
        onSendNotice: (val: T) => void
        openDirectory: (val: T) => void
        getFiles: (val: T) => void
        getPreloadFile: () => string
        getImageData: (val: T) => void
        sqliteRequest: (val: T) => any
        startReptile: (val: T) => any
        getConfig: (val: T) => any
      }
      aiApi: {
        sendChat: (val: T) => any
        onChatReply: (func: T) => void
      }
      webView: {
        openInPopup({ url, ...rest }: { [x: string]: string; url: string }): void
        onNewPopup: (func: noop) => void
      }
      appUpdater: {
        checkUpdate: () => void
        quitAndInstall: () => void
        updateProgress: (func: T) => void
        getAppVersion: () => Promise<T>
      }
    }
  }
}
