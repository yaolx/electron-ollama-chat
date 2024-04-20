import { useEffect, useState, useRef } from 'react'

import { PlusCircleOutlined, ExportOutlined, UserOutlined, ChromeFilled } from '@ant-design/icons'
import { Input, Spin } from 'antd'
import cs from 'classnames'
import { map } from 'lodash-es'
import { v4 } from 'uuid'

import styles from './style/index.module.less'

const { aiApi } = window.xElectron

const apps = [
  {
    title: '创建应用',
    key: 'add'
  },
  {
    title: 'ai中心',
    key: 'center'
  },
  {
    title: 'Chat',
    key: 'chat'
  }
]

function Ai() {
  const [app, setApp] = useState('')
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<any>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scroll({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }
  const onSelect = (key) => {
    setApp(key)
  }
  // 发送内容
  const onSend = async () => {
    if (loading || !text) {
      return
    }
    setLoading(true)
    setText('')
    const uuid = v4()
    const curMessage = {
      answer: '',
      question: text,
      id: uuid
    }
    setMessages(messages.concat([curMessage]))
    await aiApi.sendChat({
      ...curMessage,
      messages,
      type: 'document'
    })
    setLoading(false)
    scrollToBottom()
  }
  // 提交
  const onChangeText = (e) => {
    setText(e.target.value)
  }

  useEffect(() => {
    aiApi.onChatReply(({ historyMessages, id, reply, question }) => {
      setMessages(
        historyMessages.concat({
          answer: reply,
          question,
          id
        })
      )
      scrollToBottom()
    })
  }, [])

  return (
    <div className={styles.ai}>
      <div className={styles.app}>
        {apps.map((item) => {
          return (
            <div key={item.key} className={cs(styles.card, styles[item.key], { [styles.active]: app === item.key })} onClick={() => onSelect(item.key)}>
              {item.title}
            </div>
          )
        })}
      </div>
      <div className={styles.history}>
        <div className={styles.head}>
          历史记录
          <div className={styles.expand}></div>
        </div>
      </div>
      <div className={styles.talk}>
        <div className={styles.conversation}>
          <div className={cs(styles.content, styles.scroll_none)} ref={messagesEndRef}>
            {map(messages, (item) => {
              return (
                <div key={item.id}>
                  <div className={styles.question}>
                    <UserOutlined />
                    <div className={styles.question_text}>{item.question}</div>
                  </div>
                  <div className={styles.answer}>
                    <ChromeFilled />
                    <div className={styles.answer_text}> {item.answer || <Spin />}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className={styles.input}>
          <PlusCircleOutlined className={styles.upload} />
          <Input.TextArea
            placeholder={'请输入你的问题或需求'}
            className={styles.textarea}
            rows={1}
            autoSize
            value={text}
            onChange={onChangeText}
            onPressEnter={onSend}
          />
          <ExportOutlined className={cs(styles.send, { [styles.disabled]: !text })} onClick={onSend} />
        </div>
      </div>
    </div>
  )
}
export default Ai
