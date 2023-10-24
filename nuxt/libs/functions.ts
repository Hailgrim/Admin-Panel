import type { ISideBarMenuItem } from './types'

/**
 * @param {string} href Checked link
 * @returns {boolean} true if link found in the navigation tree
 */
export function checkActiveLink(href: string, navTree: Partial<ISideBarMenuItem>): boolean {
  const result
    = (navTree.href && href.startsWith(navTree.href))
    || !!navTree.childs?.some(nav => checkActiveLink(href, nav))
  return result
}

/**
 * @param {RegExp} regex Regular expression
 * @param {string} payload The string being checked
 * @returns {boolean} true if the payload matches a regular expression
 */
export function testString(regex: RegExp, payload: string): boolean {
  return new RegExp(regex).test(payload)
}

/**
 * @param {any} error Some request error
 * @returns {string} Formatted error text
 */
export function makeErrorText(error: any): string {
  const { $i18n } = useNuxtApp()
  let result = $i18n.t('unknownError')

  if (
    error === undefined
    || typeof error == 'string'
    || typeof error == 'number'
  )
    return result

  if ('status' in error && error.status === 429)
    return $i18n.t('tooManyRequests')

  const errorObj = Object(error)
  if (errorObj?.data?.message) {
    if (Array.isArray(errorObj.data.message))
      result = (errorObj.message as Array<string>).join('; ').concat('.')
    else
      result = String(errorObj.message)
  }

  return result
}

/**
 * @param {Partial<T>} oldObject Original object
 * @param {Partial<T>} newObject Updated object
 * @returns {Partial<T>} An object with changed fields only
 */
export function getUpdatedValues<T>(oldObject: Partial<T>, newObject: Partial<T>): Partial<T> {
  const result: Partial<T> = {}
  for (const value in newObject) {
    if (newObject[value] !== oldObject[value])
      result[value] = newObject[value]
  }
  return result
}
