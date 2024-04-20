import { injectable } from 'inversify'

import { BaseController } from '../baseController'

// 文件夹
@injectable()
export class FolderController extends BaseController {
  name = 'folder'

  // 创建
  async create(data: { parentId: string; title: string }) {
    return (await this._db.db.table(this.name).insert(data).returning('*'))[0]
  }

  // 查询所有
  async list(directoryId = '', { title = '' }) {
    return await this._db.db
      .table(this.name)
      .where(function () {
        if (title) {
          this.whereLike('title', `%${title}%`)
        }
      })
      .where(function () {
        if (directoryId) {
          this.where({ directoryId })
        }
      })
      .select('*')
  }

  // 删除
  async delete(id: string) {
    try {
      await this._db.db.table(this.name).where({ id }).del()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
