import React from 'react'
import { Link } from 'react-router-dom'

import { Image } from 'antd'
import classNames from 'classnames'

import style from './index.module.less'

const defaultEmptyImg = './img/empty.png'

export default function Empty({ tip = '暂无数据', description, className, emptyImg }) {
  return (
    <div className={classNames(style['empty-wrap'], className)}>
      <Image src={emptyImg || defaultEmptyImg} alt="" />
      <p>{tip}</p>
      {description}
    </div>
  )
}
