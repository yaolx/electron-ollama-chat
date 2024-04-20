import { HashRouter } from 'react-router-dom'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import ReactDOM from 'react-dom/client'

import Router from '@/routes'
import 'dayjs/locale/zh-cn'

import './assets/index.less'

dayjs.locale('zh-cn')
// 使用StrictMode，会触发2次render
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <Router />
    </ConfigProvider>
  </HashRouter>
)
