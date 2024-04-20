import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import cs from 'classnames'
import { map, find } from 'lodash-es'

import Icon from '@/components/icon'
import { MENUS } from '@/constants/global'

import styles from './styles/index.module.less'

interface MenuProps {
  onClickMenu: (url: string) => void
}

function Menu(props: MenuProps) {
  const hash = location.hash
  const navigate = useNavigate()
  const onSelectMenu = (menu) => {
    navigate(`/${menu.id}`)
  }
  const activeHash = hash.slice(2)
  useEffect(() => {
    const menu = find(MENUS, {
      id: activeHash
    })
    if (menu?.url) {
      props.onClickMenu(menu.url)
    }
  }, [activeHash])
  return (
    <div className={styles.menu}>
      {map(MENUS, (menu) => {
        const activeClass = menu.id === activeHash ? styles.active : ''
        return (
          <div key={menu.id} onClick={() => onSelectMenu(menu)} className={cs(styles.menu_item, activeClass)}>
            <Icon type={menu.icon} />
            <span className={styles.menu_title}>{menu.title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Menu
