import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { LeftSquareOutlined, RightSquareOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import cs from 'classnames'

import Modal from '@/components/modal/drawer'
import Suspense from '@/components/suspense'

import Header from './header'
import Menu from './menu'
import styles from './styles/index.module.less'
import User from './user'
const { Content, Sider } = Layout

function LayoutIndex() {
  const [webviewUrl, setWebviewUrl] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const collapsedClass = collapsed ? '' : styles.collapsed
  const onClickMenu = (url) => {
    setWebviewUrl(url)
  }
  return (
    <Layout className={styles.layout}>
      <Header />
      <Layout className={styles.center}>
        <Sider className={cs(styles.sider, collapsedClass)} collapsedWidth="0" trigger={null} collapsed={collapsed}>
          <User />
          <Menu onClickMenu={onClickMenu} />
          <div className={cs(styles.folder, collapsedClass)}>
            {collapsed ? <RightSquareOutlined onClick={() => setCollapsed(!collapsed)} /> : <LeftSquareOutlined onClick={() => setCollapsed(!collapsed)} />}
          </div>
        </Sider>
        <Content className={styles.content}>
          <Suspense>
            <Outlet context={{ url: webviewUrl }} />
          </Suspense>
          <Modal />
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutIndex
