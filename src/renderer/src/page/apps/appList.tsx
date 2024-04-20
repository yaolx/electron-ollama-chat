import { useState } from 'react'

import { PlusCircleTwoTone } from '@ant-design/icons'
import { Tooltip, Drawer, Space, Button, Form, Input } from 'antd'
import cs from 'classnames'
import { map } from 'lodash-es'

import AppItem from './appItem'
import styles from './style/index.module.less'
const { mainView } = window.xElectron
interface AppListProps {
  categories: Categories[]
  isRecent?: boolean
  onRefresh?: () => void
}
function AppList(props: AppListProps) {
  const { categories, isRecent, onRefresh } = props
  const [curCategory, setCurCategory] = useState(0)
  const [siteEditVisible, setSiteEditVisible] = useState(false)
  const recentTabClass = isRecent ? styles.recentTab : ''
  // 切换tab
  const onChangeTab = (index) => {
    setCurCategory(index)
  }

  const showSiteEdit = () => {
    setSiteEditVisible(!siteEditVisible)
  }

  const [form] = Form.useForm()
  // 点击确定
  const onOk = () => {
    form.validateFields().then(async (values) => {
      await mainView.sqliteRequest({
        msg: 'add_myapp',
        data: {
          title: values.siteName,
          url: values.siteUrl,
          icon: 'app'
        }
      })
      onRefresh && onRefresh()
      showSiteEdit()
    })
  }

  return (
    <div className={styles.appList}>
      <div className={styles.tabs}>
        {map(categories, (cate, index) => {
          const activeClass = curCategory === index || isRecent ? styles.active : ''
          return (
            <div className={cs(styles.tab, activeClass, recentTabClass)} onClick={() => onChangeTab(index)} title={cate.title} key={index}>
              {cate.title}
            </div>
          )
        })}
        {isRecent ? null : (
          <Tooltip title="添加自定义网站">
            <PlusCircleTwoTone className={styles.add} onClick={showSiteEdit} />
          </Tooltip>
        )}
      </div>
      <div className={styles.content}>
        {map(categories[curCategory].children, (item, index) => {
          return <AppItem {...item} key={index} onRefresh={onRefresh} />
        })}
      </div>
      <Drawer
        open={siteEditVisible}
        width={620}
        maskClosable
        closeIcon={false}
        getContainer="#app_center"
        rootStyle={{ position: 'absolute' }}
        footer={
          <Space>
            <Button onClick={showSiteEdit}>取消</Button>
            <Button type="primary" onClick={onOk}>
              确定
            </Button>
          </Space>
        }
        title="应用配置"
        onClose={showSiteEdit}
      >
        <Form name="siteEdit" form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }} initialValues={{}} autoComplete="off">
          <Form.Item
            label="站点URL"
            name="siteUrl"
            rules={[
              { required: true, message: '请输入站点URL!' },
              () => ({
                validator(_, value) {
                  let isError = false
                  let url
                  try {
                    url = new URL(value)
                  } catch (error) {
                    isError = true
                  }
                  if (!value || (!isError && ['http:', 'https:'].includes(url.protocol))) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('请输入有效的URL!'))
                }
              })
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="名称" name="siteName" rules={[{ required: true, message: '请输入站点名称!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
export default AppList
