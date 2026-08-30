// src/i18n/utils.test.ts
import { describe, expect, it } from 'vitest'

import { sprintf } from './utils'

describe('sprintf', () => {
  it('подставляет аргументы по плейсхолдерам %s', () => {
    expect(sprintf('Page %s of %s', 2, 3)).toBe('Page 2 of 3')
  })

  it('значение с % не перехватывает следующую подстановку', () => {
    expect(sprintf('(%s, %s)', '100%', 2)).toBe('(100%, 2)')
  })

  it('без аргументов плейсхолдер остаётся видимым', () => {
    expect(sprintf('Page %s')).toBe('Page %s')
  })

  it('значение с литералом %s не перехватывает следующую подстановку', () => {
    expect(sprintf('%s %s', 'a%s', 'b')).toBe('a%s b')
  })
})
