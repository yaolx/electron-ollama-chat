import { useEffect, useState } from 'react'

import { Input, Button, Form, Spin, Switch } from 'antd'
import { isEmpty } from 'lodash-es'

import styles from '../styles/index.module.less'
const { mainView } = window.xElectron

interface InfoProps {
  spider_site?: string
}

function Config({ close }) {
  const [info, setInfo] = useState<InfoProps>({})
  const [loading, setLoading] = useState(true)
  const getList = async () => {
    const data = await mainView.sqliteRequest({
      msg: 'get_config_detail',
      data: {
        key: 'basic'
      }
    })
    setInfo(data)
    setLoading(false)
  }

  useEffect(() => {
    getList()
  }, [])

  // 保存
  const onFinish = async (values) => {
    await mainView.sqliteRequest({
      msg: isEmpty(info) ? 'add_config' : 'put_config',
      data: {
        key: 'basic',
        content: values
      }
    })
    close && close()
  }

  if (loading) {
    return <Spin />
  }
  return (
    <div className={styles.config}>
      <Form
        name="config"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ ...info }}
      >
        <Form.Item label="本地chrome地址" name="chrome_path" rules={[{ required: true, message: '请输入本地chrome地址' }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item label="API Key" name="api_key">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="Secret Key" name="secret_key">
          <Input allowClear />
        </Form.Item>
        <Form.Item label="ai 训练模版" name="ai_template" rules={[{ required: true, message: '请输入非法证券训练模型' }]}>
          <Input.TextArea allowClear rows={10} />
        </Form.Item>
        <Form.Item label="开启ai检测" name="ai_used" valuePropName="checked">
          <Switch size="small" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Config
