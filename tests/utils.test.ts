import { describe, it, expect } from 'vitest';
import { replacePronunciation } from '../src/utils';

describe('Utils', () => {
  it('should replace pronunciation in TSML', () => {
    const tsml =
      '<tsml><acoustic_phrase><word chain="0" original="焦る" pronunciation="コゲル">焦る</word></acoustic_phrase></tsml>';
    const result = replacePronunciation(tsml, '焦る', 'アセル');
    expect(result).toContain('pronunciation="アセル"');
    expect(result).toContain('>焦る</word>');
    expect(result).not.toContain('pronunciation="コゲル"');
  });

  it('should not replace if word does not match content', () => {
    const tsml =
      '<tsml><acoustic_phrase><word chain="0" original="焦る" pronunciation="コゲル">焦る</word></acoustic_phrase></tsml>';
    const result = replacePronunciation(tsml, '違う', 'アセル');
    expect(result).toBe(tsml);
  });
});
