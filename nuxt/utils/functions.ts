import dictionary from '../locales/dictionary'
import type { IMenuItem, LangList } from './types'

/**
 * @param {string} href Checked link
 * @returns {boolean} true if link found in the navigation tree
 */
export function checkActiveLink(href: string, navTree: Partial<IMenuItem>): boolean {
  if (navTree.href) {
    if (
      navTree.href === href
      || navTree.href.startsWith(`${href}/`)
      || navTree.href.startsWith(`${href}?`)
    )
      return true
  }

  if (navTree.childs)
    return navTree.childs.some(nav => checkActiveLink(href, nav))

  return false
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

/**
 * @param {unknown} error Some request error
 * @param {LangList} lang Error language
 * @returns {string} Formatted error text
 */
export function makeErrorText(error: unknown, lang: LangList | string = 'en'): string {
  const currLang: LangList = String(lang) in dictionary ? lang as LangList : 'en'
  let result = dictionary[currLang].unknownError

  if (!(error instanceof Object))
    return result

  if ('status' in error) {
    if (error.status === 429)
      return dictionary[currLang].tooManyRequests

    if ('message' in error) {
      if (Array.isArray(error.message))
        result = (error.message as Array<string>).join('; ').concat('.')
      else
        result = String(error.message)
    }
  }

  return result
}
