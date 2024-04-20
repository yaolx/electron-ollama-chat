import styles from './style/index.module.less'
const { mainView, webView } = window.xElectron
function Msg() {
  const onClick = (text) => {
    mainView.onPlay(text)
  }
  const sendNotice = (text) => {
    mainView.onSendNotice({
      title: '通知',
      content: text,
      iconType: 'info'
    })
  }
  const openModal = (text) => {
    webView.openInPopup({
      title: text,
      content: '我来了',
      url: 'https://yaolx.github.io/'
    })
  }
  return (
    <div className={styles.msg}>
      <div className={styles.header}>
        <div>播放列表</div>
        <div className={styles.notice} onClick={() => openModal('详情')}>
          pop弹窗
        </div>
        <div className={styles.notice} onClick={() => sendNotice('班级解散')}>
          消息通知
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.title}>中国人</div>
        <div className={styles.play} onClick={() => onClick('中国人')}>
          播放
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.title}>忘情水</div>
        <div className={styles.play} onClick={() => onClick('忘情水')}>
          播放
        </div>
      </div>
    </div>
  )
}
export default Msg
