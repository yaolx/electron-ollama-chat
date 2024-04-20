import { findIndex, take, orderBy } from 'lodash-es'

import Storage from '@/utils/storage'
const localStorage = new Storage(null)
const key = 'app-recent'

export function addRecentApp(data): Categories[] {
  const apps = localStorage.get(key) || []
  const pos = findIndex(apps, {
    id: data.id
  })
  // 在历史记录里找到，则更新date_time，未找到则插入一条数据
  if (pos > -1) {
    apps[pos].date_time = new Date().valueOf()
  } else {
    apps.push({
      ...data,
      date_time: new Date().valueOf()
    })
  }
  const resApp = take(orderBy(apps, 'date_time', 'desc'), 8)
  localStorage.set(key, resApp)
  if (resApp && resApp.length > 0) {
    return [
      {
        title: '最近使用',
        children: resApp
      }
    ]
  }
  return []
}

export function getRecentApps(): Categories[] {
  const apps = localStorage.get(key) || []
  if (apps && apps.length > 0) {
    return [
      {
        title: '最近使用',
        children: apps
      }
    ]
  }
  return []
}

export function removeRecentApp(id) {
  const apps = localStorage.get(key) || []
  const pos = findIndex(apps, {
    id
  })
  // 在历史记录里找到，则更新date_time，未找到则插入一条数据
  if (pos > -1) {
    apps.splice(pos, 1)
  }
  const resApp = take(orderBy(apps, 'date_time', 'desc'), 8)
  localStorage.set(key, resApp)
  if (resApp && resApp.length > 0) {
    return [
      {
        title: '最近使用',
        children: resApp
      }
    ]
  }
  return []
}
