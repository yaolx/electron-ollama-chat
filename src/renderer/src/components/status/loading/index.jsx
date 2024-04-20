import { Spin } from 'antd'
import classNames from 'classnames'

import Img from './img/loading.svg'

import './index.less'

export default function Loading({
  children,
  loading,
  className,
  delay = 0,
  wrapperClassName,
  center = true // 默认上下居中
}) {
  return (
    <Spin
      tip="正在努力加载中…"
      delay={delay}
      indicator={<img src={Img} />}
      spinning={loading}
      className={classNames(`x-edu-loading ${center ? 'center' : ''}`, className)}
      wrapperClassName={classNames('x-edu-nested-loading', wrapperClassName)}
    >
      {children}
    </Spin>
  )
}
