import { shell } from 'electron'

const WindowOpenStyle = {
  External: 'external',
  Popup: 'popup',
  Navigate: 'navigate'
}
const UserDefineStyle = {}
const globalDefaultStyle = WindowOpenStyle.Navigate
function getDefaultStyle(webContents) {
  const { id } = webContents
  return UserDefineStyle[id] || globalDefaultStyle
}
// 外部浏览器打开
function openExternal(edata) {
  shell.openExternal(edata.url)
  return {
    action: 'deny'
  }
}
// 内部开一个modal的弹窗
function openPopup(webContents, edata, features) {
  webContents.send('new-popup', {
    url: edata.url,
    ...features
  })
  return {
    action: 'deny'
  }
}
// 本地跳转
function openNavigate(webContents, edata) {
  webContents.loadURL(edata.url)
  return {
    action: 'deny'
  }
}
function windowOpenHandler(webContents, edata) {
  const features = edata.features ? edata.features.split(',') : []
  const enableFeatures: Partial<{
    forceExternal: string
    forcePopup: string
    forceNavigate: string
  }> = {}
  features.forEach((key) => {
    const [featurekey, value] = key.split('=')
    enableFeatures[featurekey] = value ? decodeURIComponent(value) : true
  })
  const defaultStyle = getDefaultStyle(webContents)
  if (enableFeatures.forceExternal) {
    return openExternal(edata)
  } else if (enableFeatures.forcePopup) {
    return openPopup(webContents, edata, enableFeatures)
  } else if (enableFeatures.forceNavigate) {
    return openNavigate(webContents, edata)
  }
  if (defaultStyle === WindowOpenStyle.External) {
    return openExternal(edata)
  } else if (defaultStyle === WindowOpenStyle.Popup) {
    return openPopup(webContents, edata, enableFeatures)
  } else if (defaultStyle === WindowOpenStyle.Navigate) {
    return openNavigate(webContents, edata)
  }
  return {
    action: 'deny'
  }
}

export function setOpenHandler(webContents) {
  webContents.setWindowOpenHandler((edata) => windowOpenHandler(webContents, edata))
}

// 跨域处理
export function defaultSessionHandler(webContents) {
  const { session } = webContents

  session.webRequest.onHeadersReceived((details, callback) => {
    // 部分请求是小写，部分是大写，不可重复设置
    delete details.responseHeaders['access-control-allow-origin']
    delete details.responseHeaders['Access-Control-Allow-Origin']
    delete details.responseHeaders['access-control-expose-headers']
    delete details.responseHeaders['Access-Control-Expose-Headers']
    if (details.responseHeaders['Set-Cookie']) {
      details.responseHeaders['Set-Cookie'] = details.responseHeaders['Set-Cookie'].map((t) => `${t};SameSite=none;Secure`)
    }
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        'Access-Control-Expose-Headers': '*',
        ...details.responseHeaders
      }
    })
  })
}
