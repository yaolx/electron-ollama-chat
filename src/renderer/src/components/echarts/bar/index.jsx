import { numberFormat } from '@/utils/number'

import style from './index.module.less'

import ReactECharts from '../base'
import { lineTipSvg } from '../svg'

export default function Bar({ title = '', height = 520, xAxisData = [], series = [], yAxis = [], getMergeOptions = () => ({}), ...restProps }) {
  const chartStyle = {
    width: '100%',
    height
  }

  const { grid = {}, tooltip = {}, ...restOption } = getMergeOptions()

  const innerTooltip = {
    formatter(params) {
      let result = ''
      params.forEach((item, index) => {
        if (index === 0) {
          result += `<div class=${style['axis-value']}>${item.axisValue}</div>`
        }
        const marker = item.seriesType === 'line' ? `${lineTipSvg(item.color)}` : `<div class='${style.marker}' style='background-color:${item.color}'/></div>`

        result += `<div class=${style['series-item']}>
          ${marker}
          <div class=${style['series-value']}>
            ${numberFormat(item.value)}
          </div>
        </div>`
      })
      return result
    }
  }

  const getOptions = () => ({
    title,
    legend: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      confine: 'true',
      ...innerTooltip,
      ...tooltip
    },
    xAxis: [
      {
        type: 'category',
        data: xAxisData
      }
    ],
    series,
    yAxis,
    grid: {
      left: 5,
      right: 5,
      containLabel: true,
      ...grid
    },
    ...restOption
  })
  return <ReactECharts option={getOptions()} notMerge lazyUpdate style={chartStyle} {...restProps} />
}
