import React, { useRef, useEffect } from 'react'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import { PieChart, LineChart, MapChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, GraphicComponent, DataZoomComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent,
  PieChart,
  LineChart,
  MapChart,
  BarChart,
  CanvasRenderer,
  DataZoomComponent
])

function ECharts(props) {
  const echartRef = useRef(null)

  useEffect(() => {
    function handleVisibleChange() {
      if (!document.hidden && echartRef.current) {
        echartRef.current.resize() // 修复 chrome 切换 tab 图表会消失
      }
    }
    document.addEventListener('visibilitychange', handleVisibleChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibleChange)
    }
  }, [])

  useEffect(() => {
    if (echartRef.current && props.getChartInstance) {
      props.getChartInstance(echartRef.current.getEchartsInstance())
    }
  }, [echartRef.current])

  return <ReactEChartsCore ref={echartRef} echarts={echarts} notMerge lazyUpdate {...props} />
}

export default ECharts
