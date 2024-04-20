import https from 'https'

import axios, { AxiosInstance } from 'axios'
const customOptions = {
  loading: true
}

function initInstance() {
  const instance: AxiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false // 忽略证书错误
    }),
    baseURL: 'https://10.35.19.224:8080', // 设置统一的请求前缀
    timeout: 100000 // 设置统一的超时时长
  })
  // 自定义配置
  const options = Object.assign(
    {
      repeatRequestCancel: true, // 是否开启取消重复请求, 默认为 true
      loading: false, // 是否开启loading层效果, 默认为false
      reductDataFormat: true, // 是否开启简洁的数据结构响应, 默认为true
      errorMessageShow: true, // 是否开启接口错误信息展示,默认为true
      codeMessageShow: false // 是否开启code不为0时的信息提示, 默认为false
    },
    customOptions
  )

  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      config.headers['Content-Type'] = 'multipart/form-data'
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截
  instance.interceptors.response.use(
    (response: any) => {
      if (response.data && response.data.code === 2) {
        //window.location.replace(`${window.location.origin}${window.location.pathname}#/403`)
        return response?.data // code不等于0, 页面具体逻辑就不执行了
      }
      return options.reductDataFormat ? response?.data : response
    },
    (error) => {
      options.errorMessageShow && httpErrorStatusHandle(error) // 处理错误状态码
      return Promise.reject(error) // 错误继续返回给到具体页面
    }
  )
  return instance
}
const instance = initInstance()
export default instance

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error) {
  // 处理被取消的请求
  if (axios.isCancel(error)) return console.error('请求的重复请求：' + error.message)
  let messageText = ''
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        messageText = '接口重定向了！'
        break
      case 400:
        messageText = '参数不正确！'
        break
      case 401:
        messageText = '您未登录，或者登录已经超时，请先登录！'
        break
      case 403:
        messageText = '您没有权限操作！'
        break
      case 404:
        messageText = `请求地址出错: ${error.response.config.url}`
        break // 在正确域名下
      case 408:
        messageText = '请求超时！'
        break
      case 409:
        messageText = '系统已存在相同数据！'
        break
      case 500:
        messageText = '服务器内部错误！'
        break
      case 501:
        messageText = '服务未实现！'
        break
      case 502:
        messageText = '网关错误！'
        break
      case 503:
        messageText = '服务不可用！'
        break
      case 504:
        messageText = '服务暂时无法访问，请稍后再试！'
        break
      case 505:
        messageText = 'HTTP版本不受支持！'
        break
      default:
        messageText = '异常问题，请联系管理员！'
        break
    }
  }
  if (error.message.includes('timeout')) messageText = '网络请求超时！'
  if (error.message.includes('Network')) messageText = window.navigator.onLine ? '服务端异常！' : '您断网了！'
  console.log('###messageText', messageText)
  //message.error(messageText)
}
