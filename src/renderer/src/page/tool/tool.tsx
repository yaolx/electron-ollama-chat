import { useState } from 'react'

import { Input, Button, Space } from 'antd'
import { format } from 'sql-formatter'

import styles from './style/index.module.less'

function Tool() {
  const [params, setParams] = useState({
    origin: '',
    target: ''
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setParams({
      ...params,
      [name]: value
    })
  }

  const onTransform = () => {
    const text = '" ' + params.origin.replaceAll('\n', ' " +\n" ') + '"'
    setParams({
      ...params,
      target: text
    })
    navigator.clipboard.writeText(text)
  }
  // 格式化
  const onFormat = () => {
    setParams({
      ...params,
      origin: format(params.origin)
    })
  }

  return (
    <Space direction="vertical" className={styles.tool}>
      <div className={styles.content}>
        <div className={styles.tool_item}>
          <div>原始数据</div>
          <Input.TextArea name="origin" rows={20} onChange={onChange} value={params.origin} />
        </div>
        <div className={styles.tool_item}>
          <div>目标数据</div>
          <Input.TextArea name="target" rows={20} onChange={onChange} value={params.target} />
        </div>
      </div>
      <Space>
        <Button type="primary" onClick={onFormat}>
          格式化
        </Button>
        <Button type="primary" onClick={onTransform}>
          转换
        </Button>
      </Space>
    </Space>
  )
}

export default Tool
