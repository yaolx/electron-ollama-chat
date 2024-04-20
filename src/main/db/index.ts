import { join } from 'path'

import { app, ipcMain } from 'electron'
import { injectable } from 'inversify'
import knex, { Knex } from 'knex'

@injectable()
export class LocalDB {
  declare db: Knex
  config
  async init() {
    this.db = knex({
      client: 'sqlite',
      useNullAsDefault: true,
      connection: {
        filename: join(app.getPath('userData') + '\\Cache\\', 'fgfk.db')
      },
      debug: !app.isPackaged,
      log: {
        debug(msg) {
          if (msg.sql) {
            console.log('===sql', msg.sql)
          }
        }
      }
    })
    // 新建表
    await this.sync()
  }

  async sync() {
    // directory
    await this.db.schema.hasTable('directory').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('directory', (table) => {
        table.string('id').primary()
        table.string('parentId')
        table.string('title')
      })
    })
    // folder
    await this.db.schema.hasTable('folder').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('folder', (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('directoryId')
        table.string('title')
        table.string('path')
      })
    })

    // myapp
    await this.db.schema.hasTable('app').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('app', (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('title')
        table.string('url')
        table.string('icon')
      })
    })

    // config
    await this.db.schema.hasTable('config').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('config', (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('content')
        table.string('key')
      })
    })

    // config
    await this.db.schema.hasTable('chat').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('chat', (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('user_id')
        table.string('title')
        table.string('chat')
        table.bigInteger('create_time')
      })
    })

    await this.getConfig(true)

    ipcMain.handle('get_config', async () => {
      return this.config
    })
  }
  // 获取配置，refresh是否强制更新
  async getConfig(refresh = false) {
    if (this.config && !refresh) {
      return this.config
    }
    const detail = (await this.db.table('config').where({ key: 'basic' }).select('*'))[0]
    this.config = detail?.content ? JSON.parse(detail?.content) : {}
    return this.config
  }
}
