import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

import styles from './style/index.module.less'
import Tool from './tool'
const items: TabsProps['items'] = [
  {
    key: '1',
    label: '字符串转换',
    children: <Tool />
  }
]

function Excel() {
  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <div className={styles.msg} id="excel_id">
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  )
}
export default Excel
