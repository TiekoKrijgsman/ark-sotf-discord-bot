export const LOCALE = 'en-US' as const

const pluralRules = new Intl.PluralRules(LOCALE, { type: 'ordinal' })

const suffixes = {
  zero: 'th',
  one: 'st',
  two: 'nd',
  few: 'rd',
  many: 'th',
  other: 'th'
} as const

export const formatNumberOrdinals = (number: number): string => {
  const rule = pluralRules.select(number)
  const suffix = suffixes[rule]
  return `${number.toLocaleString(LOCALE)}${suffix}`
}
