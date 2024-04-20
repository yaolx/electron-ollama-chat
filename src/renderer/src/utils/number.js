/* eslint-disable no-case-declarations */
/* 对数据进行处理的方法 */

/* 保留指定小数位，不进行四舍五入 */
function toFixed(num, decimal) {
  let num_ = num.toString()
  const index = num_.indexOf('.')
  if (index !== -1) {
    num_ = num_.substring(0, decimal + index + 1)
  } else {
    num_ = num_.substring(0)
  }
  return parseFloat(num_).toFixed(decimal)
}
/**
 * 格式化浏览数
 * a. < 10000 => 原样输出
 * b. >= 10000 => 以万（w）为单位，保留一位小数 10000-10999 => 1w+ 11000-11999 => 1.1w+
 * c. = 10000000 => 1000w
 * * c. > 10000000 => 1000w+
 * @param {number} count 点赞数量
 * @param {number} point 保留小数点位数（情况b）
 * @return {string} 格式化后的点赞数
 */
export function formatViewsCount(count, point = 1) {
  if (!count) {
    return 0
  }
  if (count < 10000) {
    return count
  } else if (count < 10000000) {
    return `${toFixed(parseFloat(count / 10000), point)}w`
  } else {
    return count > 10000000 ? '1000w+' : '1000w'
  }
}

// 指定小数位数的数字（非四舍五入）
export function customizeFixed(val, digits) {
  const reg = new RegExp(`^(-)?\\d+(?:\\.\\d{0,${digits}})?`, 'g')
  return Number(val).toString().match(reg)
}

/**
 * 将数字转换成
 * default: 万、亿、万亿
 * bytes: 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB'
 * @param {string | number} value 数字
 * @param {number} digits 小数位数
 * @param {boolean} numberObj 是否返回数字对象{value, unit}
 * @param {type} type 返回的数字类型 default、bytes
 * @param {rounding} boolean 是否四舍五入
 * @return {string}
 */
export function numberFormat(
  val,
  {
    digits = 1,
    numberObj = false,
    type = 'default',
    rounding = false
  } = {}
) {
  if (Number(val).toString() === 'NaN') {
    return val
  }
  const typeMap = {
    default: {
      k: 10000,
      sizes: ['', '万', '亿', '万亿']
    },
    bytes: {
      k: 1024,
      sizes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB', 'NB', 'DB']
    }
  }
  const value = Number(val)
  const param = {}
  const { k } = typeMap[type]
  const { sizes } = typeMap[type]
  let i
  if (value < k) {
    if (rounding) {
      param.value = value.toFixed(Number(digits)) // 四舍五入
    } else {
      param.value = customizeFixed(value, digits)
    }
    param.unit = sizes[0]
  } else {
    i = Math.floor(Math.log(value) / Math.log(k))
    if (rounding) {
      param.value = ((value / k ** i)).toFixed(Number(digits)) // 四舍五入
    } else {
      param.value = customizeFixed((value / k ** i), digits)
    }
    param.unit = sizes[i]
  }

  // 数据在 0~0.1 区间时，显示【小于0.1】
  if (value < 0.1 && value > 0) {
    return '小于0.1'
  }

  if (numberObj) {
    return param
  }
  return param.unit ? `${param.value}${param.unit}` : param.value
}
