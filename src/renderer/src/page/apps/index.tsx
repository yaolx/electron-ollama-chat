import { useEffect, useState, useReducer } from 'react'

import { Tabs } from 'antd'
import cs from 'classnames'
import { reduce, map } from 'lodash-es'

import Icon from '@/components/icon'
import Webview from '@/components/webview'
import { categories, padUserAgent } from '@/constants/global'

import AppList from './appList'
import { tabsReducer, TabsContext } from './reducer'
import styles from './style/index.module.less'
import { getRecentApps } from './utils/app-utils'

const { mainView } = window.xElectron
function Apps() {
  // 最近使用
  const [recentApps, setRecentApps] = useState<Categories[]>([])
  // tab的reducer
  const [tabState, dispatch] = useReducer(tabsReducer, {
    // 已选tab
    tabs: [],
    curTab: 'app'
  })
  const [allCategories, setAllCategories] = useState<Categories[]>([])
  // 初始化
  const init = async () => {
    const appList: Menu[] = await mainView.sqliteRequest({
      msg: 'get_myapp_list'
    })
    const curAllCategories = categories.concat([
      {
        title: '我的收藏',
        children: map(appList, (item) => {
          return {
            ...item,
            isDelete: true
          }
        })
      }
    ])
    // 所有应用
    setAllCategories(
      [
        {
          title: '全部应用',
          children: reduce(
            map(curAllCategories, 'children'),
            (arr: Menu[], item) => {
              return arr.concat(item)
            },
            []
          )
        }
      ].concat(curAllCategories)
    )
  }
  useEffect(() => {
    init()
  }, [])

  // title组件
  const tabTitleRender = (tab, showClose = true) => {
    return (
      <div className={styles.tabTitle}>
        <Icon type={tab.icon} />
        {tab.title}
        <Icon type="guanbi" onClick={(e) => onRomveTab(e, tab.id)} className={cs(styles.delete, showClose ? '' : styles.hidden)} />
      </div>
    )
  }
  useEffect(() => {
    const recent = getRecentApps()
    setRecentApps(recent)
  }, [tabState.tabs])

  const onRefresh = () => {
    init()
    const recent = getRecentApps()
    setRecentApps(recent)
  }
  // 第一个默认tab
  const defaultTab = [
    {
      label: tabTitleRender({ icon: 'app', title: '应用中心' }, false),
      key: 'app',
      children: (
        <>
          {recentApps.length > 0 ? <AppList categories={recentApps} isRecent onRefresh={onRefresh} /> : null}
          {allCategories.length > 0 ? <AppList categories={allCategories} onRefresh={onRefresh} /> : null}
        </>
      )
    }
  ]
  const genTabs = (tabs) => {
    const newTabs = map(tabs, (tab) => {
      return {
        label: tabTitleRender(tab),
        key: tab.id,
        children: <Webview id={tab.id} src={tab.url} useragent={padUserAgent} className={styles.webview}></Webview>
      }
    })
    return newTabs
  }
  // 动态添加tabs
  const allTabs = defaultTab.concat(genTabs(tabState.tabs))
  // 切换tab
  const onChangeTab = (key: string) => {
    dispatch({
      type: 'change',
      payload: key
    })
  }
  // 移除tab
  const onRomveTab = (e, key) => {
    e.stopPropagation()
    dispatch({
      type: 'remove',
      payload: key
    })
  }
  const providerValues = {
    ...tabState,
    dispatch
  }
  return (
    <div className={styles.app} id="app_center">
      <TabsContext.Provider value={providerValues}>
        <Tabs onChange={onChangeTab} items={allTabs} activeKey={tabState.curTab} className={styles.tabs} />
      </TabsContext.Provider>
    </div>
  )
}
export default Apps
