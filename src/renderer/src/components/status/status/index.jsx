import classNames from 'classnames'

import style from './index.module.less'

import Empty from '../empty'
import Loading from '../loading'

export default function Status({
  loading = false, // 显示 Loading 的条件
  empty = false, // 显示 Empty 的条件
  loadingProps = {},
  emptyProps = {},
  children,
  pageEmpty = false // Empty 是否占据整个 .content（当 Status 为 .content 的下级子节点时使用）
}) {
  const showEmpty = empty && !loading
  const { wrapperClassName, ...restProps } = loadingProps ?? {}
  const wrapCls = classNames(wrapperClassName ?? '', `${showEmpty && pageEmpty ? style['page-empty'] : ''}`)
  return (
    <Loading loading={loading} wrapperClassName={wrapCls} {...restProps}>
      {!loading && (empty ? <Empty {...emptyProps} /> : children)}
    </Loading>
  )
}
