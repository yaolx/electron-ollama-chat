import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Error403() {
  const history = useHistory()

  return (
    <div>
      您没有权限访问此页面!
      <a href="#" onClick={history.goBack}>
        ❮ 返回
      </a>
    </div>
  )
}
