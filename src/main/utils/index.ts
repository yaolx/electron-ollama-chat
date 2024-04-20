import * as path from 'path'

import { app } from 'electron'
import { isString } from 'lodash-es'
const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'asset') : path.join(__dirname, '../../asset')
export const getAssetPath = (...paths) => path.join(RESOURCES_PATH, ...paths)

export function trimAll(value) {
  return value && isString(value) ? value.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, '') : ''
}
