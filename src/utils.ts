/**
 * Replaces the pronunciation of a specific word in a TSML string.
 *
 * @param tsml The original TSML string.
 * @param word The word to find (the text content of the <word> tag).
 * @param pronunciation The new pronunciation (in Katakana).
 * @returns The modified TSML string.
 */
export function replacePronunciation(tsml: string, word: string, pronunciation: string): string {
  // Matches <word ... original="WORD" ... pronunciation="OLD" ...>WORD</word>
  // We use a regex that looks for the word as content and replaces the pronunciation attribute
  const regex = new RegExp(
    `(<word[^>]*pronunciation=")[^"]*("[^>]*>${word}</word>)`,
    'g'
  );
  return tsml.replace(regex, `$1${pronunciation}$2`);
}
