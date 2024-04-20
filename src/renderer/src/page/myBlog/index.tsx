import Webview from '@/components/webview'
import { padUserAgent } from '@/constants/global'
import useOutlet from '@/hooks/useOutlet'

import styles from './styles/index.module.less'

function MyBlog() {
  const { url } = useOutlet()
  return (
    <div className={styles.myBlog}>
      <Webview src={url} useragent={padUserAgent}></Webview>
    </div>
  )
}
export default MyBlog
