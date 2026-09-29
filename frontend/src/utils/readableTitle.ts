const JUNK = /\b(test|testing|dummy|asdf|qwerty|sample|demo|lorem|ipsum|xyz|abc)\b/i;

/**
 * Student submissions include placeholders like "dsa" or one-word entries. Public showcases
 * (the landing's network, page-header marquees) only label titles that read as real problems.
 */
export const isReadableTitle = (title: string) => {
  const t = title.trim();
  return t.length >= 10 && t.split(/\s+/).length >= 2 && !JUNK.test(t) && !/(.)\1{3,}/.test(t);
};
