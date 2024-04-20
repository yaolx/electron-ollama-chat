import { injectable } from 'inversify'

import { BaseController } from '../baseController'

// 文件夹
@injectable()
export class DirectoryController extends BaseController {
  name = 'directory'

  // 创建
  async create(data: { parentId: string; title: string }) {
    return (await this._db.db.table(this.name).insert(data).returning('*'))[0]
  }

  // 查询所有
  async list() {
    return await this._db.db.table(this.name).select('*')
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
