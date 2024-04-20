import React from 'react'

import { Layout, Avatar } from 'antd'

import logo from '@/assets/logo.ico'
import IconFont from '@/components/icon'

import Setting from './settting'
import styles from './styles/index.module.less'

const { Header } = Layout
const { mainView } = window.xElectron
function HeaderLayout() {
  const onClickToolbar = (type) => {
    mainView.onToolbar(type)
  }
  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        <Avatar src={logo} size="small" />
      </div>
      <div className={styles.drag_area}></div>
      <div className={styles.oper_btns}>
        <Setting />
        <IconFont type="suoxiao" className={styles.btn} onClick={() => onClickToolbar('mini')} />
        <IconFont type="fangda" className={styles.btn} onClick={() => onClickToolbar('big')} />
        <IconFont type="guanbi" className={styles.btn} onClick={() => onClickToolbar('close')} />
      </div>
    </Header>
  )
}

export default React.memo(HeaderLayout)
