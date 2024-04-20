import { createContext } from 'react'

import { noop, findIndex, filter, cloneDeep } from 'lodash-es'
export function tabsReducer(state, action) {
  switch (action.type) {
    // 增加tab
    case 'add': {
      const { tabs } = state
      const pos = findIndex(tabs, {
        id: action.payload.id
      })
      const newTabs: Menu[] = [...tabs]
      const newCurTab = action.payload.id
      if (pos === -1) {
        newTabs.push(action.payload)
      }
      return {
        ...state,
        tabs: newTabs,
        curTab: newCurTab
      }
    }
    // 移除tab
    case 'remove': {
      const { tabs, curTab } = state
      const targetTab = action.payload
      const pos = findIndex(tabs, {
        id: targetTab
      })
      const newTabs = filter(tabs, (tab) => tab.id !== targetTab)
      let newCurTab = cloneDeep(curTab)
      if (newTabs.length && targetTab === curTab) {
        const newTab = newTabs[pos === newTabs.length ? pos - 1 : pos]
        newCurTab = newTab.id
      }
      return {
        ...state,
        tabs: newTabs,
        curTab: newTabs.length === 0 ? 'app' : newCurTab
      }
    }
    // 切号tab
    case 'change': {
      return {
        ...state,
        curTab: action.payload
      }
    }
    default:
      return state
  }
}

export const TabsContext = createContext({
  tabs: [],
  dispatch: noop
})
