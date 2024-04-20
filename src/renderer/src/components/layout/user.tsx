import styles from './styles/index.module.less'

function User() {
  return (
    <div className={styles.user}>
      <div className={styles.avatar}></div>
      <div className={styles.name}>yaolx</div>
    </div>
  )
}

export default User
