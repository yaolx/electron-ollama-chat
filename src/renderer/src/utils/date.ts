import dayjs from 'dayjs'

export function getWeekReportTitle() {
  const date = new Date()
  const Time = date.getTime()
  const day = date.getDay()
  const oneDayTime = 24 * 60 * 60 * 1000

  //周一
  const MondayTime = Time + (1 - day) * oneDayTime
  //周日
  const FridayTime = Time + (5 - day) * oneDayTime

  const monday = dayjs(MondayTime).format('YYYY年MM月DD日')
  const friday = dayjs(MondayTime).year() === dayjs(FridayTime).year() ? dayjs(FridayTime).format('MM月DD日') : dayjs(FridayTime).format('YYYY年MM月DD日')

  return `${monday}-${friday}`
}
