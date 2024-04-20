/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react'

import { Space } from 'antd'
import cs from 'classnames'
import { v4 } from 'uuid'

import Icon from '@/components/icon'
import { chromeAgent } from '@/constants/global'

import styles from './styles/index.module.less'

const { mainView } = window.xElectron
interface WebviewProps {
  src: string
  className?: string
  useragent?: string
  id?: string
  phoneUserAgent?: string
}
function Webview(props: WebviewProps) {
  const { src, className, phoneUserAgent = chromeAgent } = props
  const [goParams, setGoParams] = useState({
    back: false,
    forward: false
  })
  const webviewRef = useRef<WebviewTag>(null)
  useEffect(() => {
    const { current } = webviewRef
    if (current) {
      current.addEventListener('dom-ready', async () => {
        const uuid = v4()
        console.log(`'window['debug${uuid}']()' to open devtool for webview`)
        window[`debug${uuid}`] = () => {
          current && current.openDevTools()
        }
      })
      const genGoParams = () => {
        setGoParams({
          back: current.canGoBack(),
          forward: current.canGoForward()
        })
      }
      current.addEventListener('did-navigate', genGoParams)
      current.addEventListener('did-navigate-in-page', genGoParams)
    }
    return () => {
      current && current.removeEventListener('dom-ready', () => {})
      current && current.removeEventListener('did-navigate', () => {})
      current && current.removeEventListener('did-navigate-in-page', () => {})
    }
  }, [])
  // 刷新
  const onRefresh = () => {
    const { current } = webviewRef
    current && current.reload()
  }
  // 前进后退
  const go = (action) => {
    const { current } = webviewRef
    if (current) {
      if (action === -1) {
        current.goBack()
      } else {
        current.goForward()
      }
    }
  }

  const preloadFile = useMemo(() => {
    return mainView.getPreloadFile()
  }, [])
  // allowpopups是字符串的true，用boolean不起作用
  const trueAsStr = 'true' as never
  return (
    <div className={styles.chrome}>
      <div className={styles.toolbar}>
        <Space className={styles.toolbar_left}>
          <Icon type="left" onClick={() => go(-1)} className={goParams.back ? '' : styles.disbaled} />
          <Icon type="right" onClick={() => go(1)} className={goParams.forward ? '' : styles.disbaled} />
          <Icon type="refresh" className={styles.refresh} onClick={onRefresh} />
        </Space>
      </div>
      <webview
        ref={webviewRef}
        src={src}
        disablewebsecurity={trueAsStr}
        className={cs(styles.webview, className)}
        allowpopups={trueAsStr}
        useragent={phoneUserAgent}
        partition="persist:webview"
        preload={preloadFile}
      ></webview>
    </div>
  )
}
export default Webview
