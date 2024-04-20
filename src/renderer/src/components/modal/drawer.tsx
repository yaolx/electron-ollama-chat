import { useEffect, useState } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import { Drawer } from 'antd'

import Webview from '@/components/webview'
import { phoneUserAgent } from '@/constants/global'

import styles from './styles/index.module.less'

interface DrawerProps {
  url: string
  title: string
}

const { webView } = window.xElectron
function Modal() {
  const [drawer, setDrawer] = useState<Partial<DrawerProps>>({})
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    webView.onNewPopup((data) => {
      setDrawer(data)
      setVisible(true)
    })
  }, [])
  return (
    <Drawer
      placement="right"
      open={visible}
      title={drawer.title}
      closable={false}
      width={500}
      getContainer={false}
      className={styles.modal}
      extra={<CloseOutlined onClick={() => setVisible(false)} />}
    >
      {drawer.url ? <Webview src={drawer.url} className={styles.webview} useragent={phoneUserAgent}></Webview> : null}
    </Drawer>
  )
}

export default Modal
