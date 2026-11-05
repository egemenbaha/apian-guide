const STOP_WORDS = new Set('ve veya ile icin bir bu su mi mu ne nasil nerede nereden nereye nereler nerelerde hangi hangisi hangileri kadar olarak acaba bana yapabilirim bulabilirim alabilirim istiyorum'.split(' '));
const SYNONYMS = [
  ['wifi', 'wlan', 'internet'], ['gym', 'fitness', 'spor'],
  ['eczane', 'apotheke', 'pharmacy'], ['kaution', 'depozito'],
  ['fotokopi', 'copyshop', 'copyservice', 'printer', 'print', 'yazici', 'cikti'],
  ['rundfunkbeitrag', 'gez'], ['oturum', 'aufenthalt', 'auslanderbehorde'],
  ['anmeldung', 'ikamet'], ['camasir', 'camasirhane', 'laundry', 'waschsalon'],
  ['firin', 'backerei', 'bakery'], ['getrankemarkt', 'icecek'],
  ['nakit', 'cash', 'bargeld'], ['bozuk', 'madeni', 'munze', 'munzen'],
  ['cop', 'atik', 'mull', 'muell'], ['perde', 'vorhang'],
  ['calismiyor', 'baglanamiyorum', 'baglanmiyor', 'sorun', 'ariza'],
];
const TEXT_WORDS = /wi[\s-]+fi|[\p{L}\p{N}]+/giu;

/** Fold Turkish/German spelling and punctuation into searchable words. */
export function normalize(text) {
  return text.toLocaleLowerCase('tr').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/ß/g, 'ss')
    .replace(/\bwi[\s-]+fi\b/g, 'wifi').replace(/\bapian\s*([12])\b/g, 'apian $1')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function plainText(markdown) {
  return markdown.replace(/\[([^\]]+)\]\([^\s)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '').replace(/^\|[\s|:-]+\|$/gm, '')
    .replace(/^- \[ \] /gm, '').replace(/[*_`#]/g, '').replace(/\|/g, ' · ')
    .replace(/\s+/g, ' ').replace(/(?:\s*·\s*){2,}/g, ' · ').trim();
}

const words = text => normalize(text).split(' ').filter(Boolean);
const suffixes = /^(?:lar|ler|lari|leri|in|un|nin|nun|i|u|yi|yu|a|e|ya|ye|da|de|ta|te|dan|den|tan|ten|daki|deki|ndaki|ndeki|im|um|m|ni|nu|n|na|ne|si|su|sini|sunu|ini|unu|inin|unun|lik|luk)$/;

function relatedWord(query, word, allowCompletion = false) {
  if (query === word) return 1;
  if (/\d/.test(query) || /\d/.test(word) || Math.min(query.length, word.length) < 3) return 0;
  // Prefix completion plus conservative Turkish suffixes; short bank names stay exact.
  if (word.startsWith(query) && query.length >= 4 && (allowCompletion || suffixes.test(word.slice(query.length)))) return .88;
  if (query.startsWith(word) && word.length >= 4 && suffixes.test(query.slice(word.length))) return .86;
  return 0;
}

// Bounded optimal-string-alignment distance includes adjacent letter swaps.
function editDistance(a, b, maximum) {
  if (Math.abs(a.length - b.length) > maximum) return maximum + 1;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  let beforePrevious;
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        current[j] = Math.min(current[j], beforePrevious[j - 2] + 1);
      }
    }
    if (Math.min(...current) > maximum) return maximum + 1;
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length];
}

function documentEntry({ title, body, context, ...metadata }) {
  return {
    ...metadata, title, body, context,
    fields: [
      { tokens: [...new Set(words(title))], weight: 8 },
      { tokens: [...new Set(words(body))], weight: 2 },
      { tokens: [...new Set(words(context))], weight: 1 },
    ],
    normalizedTitle: normalize(title),
    normalizedBody: normalize(body),
  };
}

/** Prepare the FAQ once. Only visible text is indexed, never source-link URLs. */
export function createSearchIndex(topics, questions) {
  const locations = new Map();
  const documents = topics.map(topic => {
    topic.questionIds.forEach((ids, section) => ids.forEach(id => locations.set(id, { topic, section: topic.sections[section] })));
    return documentEntry({ href: `#${topic.id}`, title: topic.title, body: topic.sections.join(' · '), context: '', label: 'Konu', kind: 'topic' });
  });
  for (const question of questions) {
    const location = locations.get(question.id);
    if (!location) continue;
    const { topic, section } = location;
    documents.push(documentEntry({
      href: `#${topic.id}/soru-${question.id}`, title: question.question,
      body: plainText(question.answer), context: `${topic.title} ${section}`,
      paragraphs: question.answer.split(/\n\s*\n/).map(plainText),
      label: `${topic.title} › ${section}`, kind: 'question',
    }));
  }
  const vocabulary = [...new Set(documents.flatMap(doc => doc.fields.flatMap(field => field.tokens)))];
  return { documents, vocabulary };
}

function expandTerm(term, vocabulary) {
  const variants = new Map();
  const allowCompletion = !vocabulary.includes(term);
  for (const word of vocabulary) {
    const quality = relatedWord(term, word, allowCompletion);
    if (quality) variants.set(word, quality);
  }
  const aliases = SYNONYMS.filter(group => group.some(alias => relatedWord(term, alias))).flat();
  for (const word of vocabulary) {
    for (const alias of aliases) {
      const quality = relatedWord(alias, word) * .78;
      if (quality > (variants.get(word) || 0)) variants.set(word, quality);
    }
  }
  // Only try spelling corrections when this term has no literal/alias match.
  if (variants.size || term.length < 4 || term.length > 40 || /\d/.test(term)) return { variants, approximate: false };
  let closest = term.length >= 7 ? 2 : 1;
  for (const word of vocabulary) {
    if (word.length < 4 || /\d/.test(word)) continue;
    const distance = editDistance(term, word, closest);
    if (distance > closest) continue;
    if (distance < closest) { closest = distance; variants.clear(); }
    variants.set(word, .55);
  }
  return { variants, approximate: variants.size > 0 };
}

function excerpt(text, matchedWords, length = 180) {
  if (text.length <= length) return text;
  const hits = [...text.matchAll(TEXT_WORDS)].filter(match => matchedWords.has(normalize(match[0])));
  const firstHit = hits[0]?.index || 0;
  let start = firstHit < length ? 0 : Math.max(0, firstHit - 45);
  if (start) {
    const sentence = text.lastIndexOf('. ', firstHit);
    if (sentence >= start) start = sentence + 2;
    else {
      const boundary = text.indexOf(' ', start);
      if (boundary !== -1) start = boundary + 1;
    }
  }
  let end = Math.min(text.length, start + length);
  if (end < text.length) {
    const boundary = text.lastIndexOf(' ', end);
    if (boundary > start) end = boundary;
  }
  return `${start ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

function excerptSource(doc, building) {
  if (!building || !doc.paragraphs) return doc.body;
  // Prefer a paragraph directly about the requested building over a passing comparison.
  const candidates = doc.paragraphs.map(text => ({ text, position: normalize(text).indexOf(building) }))
    .filter(paragraph => paragraph.position >= 0)
    .sort((a, b) => a.position - b.position);
  return candidates[0]?.text || doc.body;
}

/** Rank matching topics/questions, keeping every meaningful query term required. */
export function findMatches(query, index) {
  const normalized = normalize(query.slice(0, 180));
  const terms = [...new Set(normalized.split(' '))].filter(term => term && !STOP_WORDS.has(term) && (term.length > 1 || /^\d$/.test(term))).slice(0, 16);
  if (!terms.length) return [];
  const expanded = terms.map(term => expandTerm(term, index.vocabulary));
  if (expanded.some(term => !term.variants.size)) return [];
  const building = normalized.match(/\bapian ([12])\b/)?.[0];
  const matches = [];
  for (const doc of index.documents) {
    if (building && !`${doc.normalizedTitle} ${doc.normalizedBody} ${normalize(doc.context)}`.includes(building)) continue;
    let score = 0;
    const matchedWords = new Set();
    let complete = true;
    for (const [termIndex, { variants }] of expanded.entries()) {
      let best = 0;
      for (const field of doc.fields) {
        for (const word of field.tokens) {
          const quality = variants.get(word) || 0;
          if (quality) matchedWords.add(word);
          best = Math.max(best, quality * field.weight);
        }
      }
      if (!best) { complete = false; break; }
      // A requested building filters the results; the actual subject determines rank.
      const buildingTerm = building && ['apian', building.at(-1)].includes(terms[termIndex]);
      score += best * (buildingTerm ? .15 : 1);
    }
    if (!complete) continue;
    if (doc.normalizedTitle === normalized) score += 16;
    else if (doc.normalizedTitle.includes(normalized)) score += 6;
    if (doc.kind === 'question') score += 1;
    const excerptWords = new Set([...matchedWords].filter(word => !building || !['apian', building.at(-1)].includes(word)));
    matches.push({ href: doc.href, title: doc.title, label: doc.label, kind: doc.kind,
      excerpt: excerpt(excerptSource(doc, building), excerptWords), matchedWords: [...matchedWords],
      approximate: expanded.some(term => term.approximate), score });
  }
  return matches.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'tr'));
}

/** Text segments for safe DOM highlighting without injecting query HTML. */
export function highlightSegments(text, matchedWords) {
  const matched = new Set(matchedWords);
  const segments = [];
  let position = 0;
  for (const word of text.matchAll(TEXT_WORDS)) {
    if (!matched.has(normalize(word[0]))) continue;
    segments.push({ text: text.slice(position, word.index), matched: false }, { text: word[0], matched: true });
    position = word.index + word[0].length;
  }
  segments.push({ text: text.slice(position), matched: false });
  return segments;
}
