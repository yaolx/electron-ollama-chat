import { ipcMain } from 'electron'

import { AppController, ConfigController, DirectoryController, FolderController } from '../db/controller'
import { ioc } from '../ioc'

// 接口请求
export async function sqliteRequest() {
  ipcMain.handle('sqlite-request', async (_event, args) => {
    const { msg, data } = args
    switch (msg) {
      /* app：我的应用 */
      case 'add_myapp':
        return await ioc.get(AppController).create(data)
      case 'get_myapp_list':
        return await ioc.get(AppController).list()
      case 'delete_myapp':
        return await ioc.get(AppController).delete(data.id)
      /* directory：目录 */
      case 'add_directory':
        return await ioc.get(DirectoryController).create(data)
      case 'get_directory_list':
        return await ioc.get(DirectoryController).list()
      case 'delete_directory':
        return await ioc.get(DirectoryController).delete(data.id)
      /* folder：文件夹 */
      case 'add_folder':
        return await ioc.get(FolderController).create(data)
      case 'get_folder_list':
        return await ioc.get(FolderController).list(data.directoryId, {
          title: data.title
        })
      case 'delete_folder':
        return await ioc.get(FolderController).delete(data.id)
      /* folder：文件夹 */
      case 'add_config':
        return await ioc.get(ConfigController).create(data)
      case 'get_config_detail':
        return await ioc.get(ConfigController).get(data.key)
      case 'put_config':
        return await ioc.get(ConfigController).put(data.key, data.content)
      default:
        return ''
    }
  })
}
