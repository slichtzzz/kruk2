export const SMUFL = {
  eighthUp: '\uE1D7',
  quarterUp: '\uE1D5',
  halfUp: '\uE1D3',
  whole: '\uE1D2',
  dot: '\uE1E7', 
  flat: '\uE260',
  sharp: '\uE262',
  ledger: '\uE022', 
  clef: '\uE050',
  eighthDown: '\uE1D8',
  quarterDown: '\uE1D6',
  halfDown: '\uE1D4',
};

export const PITCH_CONFIG = {
  'G': { offset: -3 }, 
  'N': { offset: -2 }, 
  'h': { offset: -1 }, 
  'g': { offset: 0 },  
  'n': { offset: 1 },  
  's': { offset: 2 },  
  'm': { offset: 3 },  
  'p': { offset: 4 },  
  'v': { offset: 5.2 },  
  'M': { offset: 6.2 },  
  'P': { offset: 7.3 },  
  'V': { offset: 8.4 },  
};

const getLedgerLines = (offset) => {
  const lines = [];
  const val = Math.floor(offset);
  if (val <= 0) {
    for (let p = 0; p >= val; p -= 2) {
      lines.push(p);
    }
  }

  if (val >= 8.5) {
    for (let p = 8; p <= val; p += 2) {
      lines.push(p);
    }
  }
  
  return lines;
};


export const parseHightsForBravura = (hightsString) => {
  if (!hightsString) return [];
  if (typeof hightsString !== 'string') return [];
  
  const normalized = hightsString.replace(/Г/g, 'G').replace(/Н/g, 'N').replace(/ц/g, 'h')
    .replace(/г/g, 'g').replace(/н/g, 'n').replace(/с/g, 's').replace(/м/g, 'm')
    .replace(/п/g, 'p').replace(/в/g, 'v').replace(/М/g, 'M').replace(/П/g, 'P').replace(/В/g, 'V');
  
  const matches = [...normalized.matchAll(/([a-zA-Z])([#bn])?(!|[1-6])/g)];
  
  return matches.map(m => {
    const [_, pChar, accChar, dChar] = m;
    const p = PITCH_CONFIG[pChar];
    if (!p) return null;

    const isDown = p.offset > 5.2;

    let char = isDown ? SMUFL.quarterDown : SMUFL.quarterUp;
    let hasDot = false;

    if (dChar === '!') {
      char = isDown ? SMUFL.eighthDown : SMUFL.eighthUp;
    } 
    else if (dChar === '2') {
      char = isDown ? SMUFL.halfDown : SMUFL.halfUp;
    } 
    else if (dChar === '3') {
      char = isDown ? SMUFL.halfDown : SMUFL.halfUp;
      hasDot = true;
    }
    else if (dChar === '4') {
      char = isDown ? SMUFL.whole : SMUFL.whole;
    }
    else if (dChar === '5') {
      char = isDown ? SMUFL.quarterDown : SMUFL.quarterUp;
      hasDot = true;
    }

    let accidental = null;
    if (accChar === 'b') accidental = SMUFL.flat;
    else if (accChar === '#') accidental = SMUFL.sharp;
    
    if (pChar === 'M' && !accChar) {
      accidental = SMUFL.flat;
    }

    return {
      offset: p.offset,
      char: char,
      accidental: accidental,
      ledgers: getLedgerLines(p.offset),
      dot: hasDot ? SMUFL.dot : null,
      isDown: isDown
    };
  }).filter(Boolean);
};
