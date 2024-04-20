import { compact } from 'lodash-es'
// iphone 内核
export const phoneUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
// pad 内核
export const padUserAgent =
  'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1'
//
export const chromeAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76'
export const categories = [
  {
    title: '常用网站',
    children: []
  }
]
const { MODE } = import.meta.env
export const MENUS: Menu[] = compact([
  MODE === 'development'
    ? {
        title: '组件demo',
        id: 'demo',
        icon: 'component'
      }
    : null,
  {
    title: '应用中心',
    id: 'apps',
    icon: 'app'
  },
  {
    title: 'chat',
    id: 'ai',
    icon: 'app'
  },
  {
    title: '开发工具',
    id: 'tool',
    icon: 'app'
  }
])
