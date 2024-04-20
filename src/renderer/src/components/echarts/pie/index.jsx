import ReactECharts from '../base'

export default function Pie({ data = [], radius = '50%', height, getMergeOptions = () => ({}) }) {
  const chartStyle = {
    width: '100%',
    height: `${height || 520}px`
  }
  const { title = {}, tooltip = {}, legend = {}, label = {}, labelLine = {}, series = {}, ...restOption } = getMergeOptions()
  const getOptions = () => ({
    title,
    legend: {
      orient: 'horizontal',
      bottom: 'top',
      selectedMode: false,
      ...legend
    },
    label: {
      show: false,
      position: 'center',
      ...label
    },
    labelLine: {
      show: false,
      ...labelLine
    },
    tooltip: {
      trigger: 'item',
      confine: 'true',
      ...tooltip
    },
    series: [
      {
        type: 'pie',
        data,
        center: ['45%', '50%'],
        radius,
        ...series
      }
    ],
    ...restOption
  })
  return <ReactECharts option={getOptions()} notMerge lazyUpdate style={chartStyle} />
}
