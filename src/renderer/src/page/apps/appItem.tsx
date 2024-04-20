import { useContext } from 'react'

import { CloseOutlined } from '@ant-design/icons'
import { Modal } from 'antd'

import Icon from '@/components/icon'

import { TabsContext } from './reducer'
import styles from './style/index.module.less'
import { addRecentApp, removeRecentApp } from './utils/app-utils'

const { mainView } = window.xElectron
function AppItem(props: Menu & { onRefresh: () => void }) {
  const { title, icon, isDelete, id, onRefresh } = props
  const { dispatch } = useContext(TabsContext)
  const gotoDetail = () => {
    addRecentApp(props)
    dispatch({
      type: 'add',
      payload: props
    })
  }

  const onDelete = (e) => {
    e.stopPropagation()
    Modal.confirm({
      title: '确定删除？',
      async onOk() {
        await mainView.sqliteRequest({
          msg: 'delete_myapp',
          data: {
            id
          }
        })
        removeRecentApp(id)
        onRefresh && onRefresh()
      }
    })
  }
  return (
    <div className={styles.appItem} onClick={gotoDetail}>
      <div className={styles.content}>
        <Icon type={icon} className={styles.icon} />
        <div className={styles.title}>{title}</div>
        {isDelete ? <CloseOutlined onClick={onDelete} className={styles.delete} /> : null}
      </div>
    </div>
  )
}
export default AppItem
