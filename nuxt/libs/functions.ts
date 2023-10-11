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
  const { t } = useI18n()
  let result = t('unknownError')

  if (
    error === undefined
    || typeof error == 'string'
    || typeof error == 'number'
  )
    return result

  if ('status' in error && error.status === 429)
    return t('tooManyRequests')

  const errorObj = Object(error)
  if (errorObj?.data?.message) {
    if (Array.isArray(errorObj.data.message))
      result = (errorObj.message as Array<string>).join('; ').concat('.')
    else
      result = String(errorObj.message)
  }

  return result
}
