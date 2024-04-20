# wing-electron

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Publish

```bash
# For windows
$ npm run publish:win

# For macOS
$ npm run publish:mac

# For Linux
$ npm run publish:linux
```

### update log

1. 脚手架搭建，eslint 配置

2. 集成 github actions，配置 workflows，完成自动发布

3. 页面基本布局、开启 devTools、版本更新

4. 系统托盘、气泡消息通知

5. 图标资源路径问题修复、应用单实例控制

6. 集成 sqlite3 数据库，支持本地数据的增删改查

7. excel 文件读写操作

8. 窗口最大化，最小化，支持鼠标滚动放大缩小
