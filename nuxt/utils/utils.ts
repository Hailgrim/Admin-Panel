import d from '~/locales/dictionary'
import type { LangList } from '~/locales/types'

/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export const testString = (regex: RegExp, payload: string): boolean => {
  return new RegExp(regex).test(payload)
}

/**
 * @param {Partial<T>} oldObject Original object
 * @param {Partial<T>} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export const getUpdatedValues = <T>(
  oldObject: Partial<T>,
  newObject: Partial<T>
): Partial<T> => {
  const result: Partial<T> = {}
  for (const value in newObject) {
    if (newObject[value] !== oldObject[value]) result[value] = newObject[value]
  }
  return result
}

/**
 * @param {unknown} error Some request error
 * @param {string} lang Error language
 * @returns {string} Formatted error text
 */
export const makeErrorText = (error: unknown, lang: string = 'en'): string => {
  const currLang: LangList = lang in d ? (lang as LangList) : 'en'
  let result = d[currLang].unknownError

  if (!(error instanceof Object)) return result

  if ('status' in error) {
    if (error.status === 429) return d[currLang].tooManyRequests

    if ('message' in error) {
      if (Array.isArray(error.message))
        result = (error.message as Array<string>).join('.\r\n').concat('.')
      else result = String(error.message)
    }
  }

  return result
}

/**
 * @param {Date | string | number} date Parsed date
 * @returns {string} Formatted date string
 */
export const makeDateString = (
  date: Date | string | number = Date.now()
): string => {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const now = Date.now()
  const parsedDate = new Date(date)
  const parsedTime = parsedDate.getTime()

  if (isNaN(parsedTime)) return '-'

  const differenceMS = now - parsedTime
  const minuteMS = 1000 * 60
  const hourMS = minuteMS * 60
  const dayMS = hourMS * 24

  if (differenceMS < minuteMS) {
    return rtf.format(0, 'minute')
  } else if (differenceMS < hourMS) {
    return rtf.format(-1 * Math.floor(differenceMS / minuteMS), 'minute')
  } else if (differenceMS < dayMS) {
    return rtf.format(-1 * Math.floor(differenceMS / hourMS), 'hour')
  } else {
    return parsedDate.toLocaleString()
  }
}
