export default function useFormateDate(date, moment) {
  moment.locale('ru')

  if (moment(date, moment.ISO_8601, true).isValid()) {
    let resultFormat = 'DD.MM.YYYY h:mm:ss'
    const nowDate = moment(new Date()).utc()
    const momentDate = moment(date).utc()

    if (momentDate.year() === nowDate.year()) {
      if (momentDate.month() === nowDate.month() && momentDate.date() === nowDate.date()) {
        resultFormat = 'HH:mm:ss'
      }
    }

    return momentDate.format(resultFormat)
  } else {
    return ''
  }
}
