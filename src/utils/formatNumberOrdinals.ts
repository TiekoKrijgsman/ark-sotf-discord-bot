const locale = 'en-US'

const pluralRules = new Intl.PluralRules(locale, { type: 'ordinal' })

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
  return `${number.toLocaleString(locale)}${suffix}`
}
