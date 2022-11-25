import tap from 'tap'

import { pluralizeWord } from '../pluralizeWord.js'

await tap.test('utils/pluralizeWord', async (t) => {
  t.equal(pluralizeWord('word', 0), 'words')
  t.equal(pluralizeWord('word', 1), 'word')
  t.equal(pluralizeWord('word', 2), 'words')
  t.equal(pluralizeWord('word', 3), 'words')
  t.equal(pluralizeWord('member', 1), 'member')
  t.equal(pluralizeWord('member', 571), 'members')
})
