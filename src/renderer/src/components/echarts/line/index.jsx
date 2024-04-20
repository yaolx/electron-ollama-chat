import { numberFormat } from '@/utils/number'

import style from './index.module.less'

import ReactECharts from '../base'
import { lineTipSvg } from '../svg'

const chartStyle = {
  height: '450px'
}

export const Colors = ['#3BA1FF', '#14D692', '#FF8C21', '#1E62EC', '#E8684A', '#6DC8EC', '#F6BD16', '#36D169']

export default function BaseLine({
  title,
  legendData,
  xAxisData,
  series = [],
  lineColors, // 线条颜色数组，与series中的各元素对应
  bytesNames = [], // series name
  tooltipDigits = 1, // 小数位数
  ...restProps
}) {
  const formatedSeriesData = series.map((item, i) => ({
    ...item,
    itemStyle: {
      color: (lineColors || Colors)[i]
    },
    lineStyle: {
      width: 4
    }
  }))

  const innerTooltip = {
    formatter(params) {
      let result = ''
      params.forEach((item, index) => {
        if (index === 0) {
          result += `<div class=${style['axis-value']}>${item.axisValue}</div>`
        }

        const value = numberFormat(item.value, {
          digits: tooltipDigits,
          type: bytesNames.includes(item.seriesName) ? 'bytes' : 'default'
        })

        result += `<div class=${style['series-item']}>
          ${lineTipSvg(item.color)}
          <div class=${style['series-name']}>
            ${item.seriesName}
          </div>
          <div class=${style['series-value']}>
            ${value}
          </div>
        </div>`
      })
      return result
    }
  }

  const getOptions = () => ({
    animation: false,
    title: {
      text: title
    },
    tooltip: {
      trigger: 'axis',
      confine: 'true',
      ...innerTooltip
    },
    legend: {
      data: legendData
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLabel: {
        rotate: 60
      }
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      left: 16,
      right: 16,
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        left: 80,
        right: 80
      }
    ],
    series: formatedSeriesData,
    ...restProps
  })
  return (
    <ReactECharts
      option={getOptions()}
      style={{
        ...chartStyle,
        ...restProps
      }}
    />
  )
}
