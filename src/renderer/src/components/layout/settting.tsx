import { useEffect, useState } from 'react'

import { SettingOutlined } from '@ant-design/icons'
import { Button, Dropdown, Modal, Progress, Spin } from 'antd'

import styles from './styles/index.module.less'
const { appUpdater, mainView } = window.xElectron
function Setting() {
  const [visible, setVisible] = useState(false)
  const [version, setVersion] = useState('')
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tip, setTip] = useState('')
  const onClick = ({ key }) => {
    switch (key) {
      case 'devTool':
        mainView.onToolbar(key)
        break
      case 'update':
        setVisible(!visible)
        break
      default:
        break
    }
  }
  const items = [
    { label: '版本更新', key: 'update' },
    { label: '开启调试', key: 'devTool' }
  ]
  // 检查是否需要更新
  const checkUpdate = () => {
    setLoading(true)
    appUpdater.checkUpdate()
  }
  // 退出并安装更新
  const quitAndInstall = () => {
    appUpdater.quitAndInstall()
  }
  // 获取版本号
  const getAppVersion = async () => {
    const version = await appUpdater.getAppVersion()
    setVersion(version)
  }
  useEffect(() => {
    getAppVersion()
    appUpdater.updateProgress((info) => {
      switch (info.cmd) {
        case 'checking-for-update':
          break
        // 已是最新版本，无需更新
        case 'update-not-available':
          setLoading(false)
          setTip('当前版本为最新版本，无需更新')
          break
        // 有需要更新
        case 'update-available':
          break
        // 下载进度
        case 'download-progress':
          setLoading(false)
          setPercent(parseInt(info.message.percent, 10))
          break
        // 下载完成
        case 'update-downloaded':
          setLoading(false)
          setPercent(101)
          break
        default:
          break
      }
    })
  }, [])
  return (
    <>
      <Dropdown
        menu={{
          items,
          onClick
        }}
      >
        <SettingOutlined className={styles.setting} />
      </Dropdown>
      <Modal open={visible} footer={null} onCancel={() => setVisible(false)} style={{ width: '300px!important', height: 300 }}>
        <div className={styles.update}>
          <div className={styles.title}>合规风控工具</div>
          <div>版本号{version}</div>
          <Spin spinning={loading} tip="检查更新中..." />
          {loading ? null : (
            <div className={styles.text}>
              {tip ? <div className={styles.tip}>{tip}</div> : null}
              {percent > 0 && percent <= 100 ? <Progress percent={percent} /> : null}
              {percent === 0 ? (
                <Button type="primary" onClick={() => checkUpdate()}>
                  检查更新
                </Button>
              ) : null}
              {percent === 101 ? (
                <Button type="primary" onClick={() => quitAndInstall()}>
                  安装更新
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Setting
