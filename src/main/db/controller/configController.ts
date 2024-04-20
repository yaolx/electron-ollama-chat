import { injectable } from 'inversify'

import { LocalDB } from '../../db'
import { ioc } from '../../ioc'
import { BaseController } from '../baseController'
// 配置信息
@injectable()
export class ConfigController extends BaseController {
  name = 'config'

  // 创建
  async create(data: { key: string; content: string }) {
    const detail = (
      await this._db.db
        .table(this.name)
        .insert({
          key: data.key,
          content: JSON.stringify(data.content)
        })
        .returning('*')
    )[0]
    await ioc.get(LocalDB).getConfig(true)
    return detail
  }

  // 更新
  async put(key, content) {
    try {
      await this._db.db
        .table(this.name)
        .where({ key })
        .update({ content: JSON.stringify(content) })
      await ioc.get(LocalDB).getConfig(true)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // 查询详情
  async get(key) {
    const detail = (await this._db.db.table(this.name).where({ key }).select('*'))[0]
    return detail?.content ? JSON.parse(detail?.content) : {}
  }

  // 查询所有
  async list(key) {
    return await this._db.db.table(this.name).where({ key }).select('*')
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
