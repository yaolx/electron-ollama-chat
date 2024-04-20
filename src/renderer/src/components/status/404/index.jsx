import React from 'react'
import { Link } from 'react-router-dom'

import { Image } from 'antd'
import classNames from 'classnames'

import style from './index.module.less'

const errorImg = '@/components/status/404/img/404.png'

const Error404 = ({ className }) => (
  <div className={classNames(style.error, className)}>
    <Image src={errorImg} />
    <div className={style.text}>服务器开小差了，请稍后再试试</div>
    <Link className={style.back} to="/">
      返回首页
    </Link>
  </div>
)

export default Error404
