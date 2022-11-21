export const LOCALE = 'en-US' as const

const pluralRules = new Intl.PluralRules(LOCALE, { type: 'ordinal' })

const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th']
])

export const formatNumberOrdinals = (number: number): string => {
  const rule = pluralRules.select(number)
  let suffix = suffixes.get(rule)
  if (suffix == null) {
    suffix = 'th'
  }
  return `${number.toLocaleString(LOCALE)}${suffix}`
}
