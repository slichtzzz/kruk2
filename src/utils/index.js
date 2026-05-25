import React from 'react'
import { RFReactSelect, RFReactMultiSelect } from './RFReactSelect.jsx'
import Loading from './Loading'
import Header from './Header/index.jsx'
import getPageNum from './getPageNum'
import getPaperItem from './getPaperItem.jsx'
import Select from './Select'
const HOST = 'https://oko.jesser.ru/'
const HOST_APP = `${HOST}kruk/`
export const API_CHANT = `${HOST_APP}chant.php`
export const API_CHANT_DB = `${HOST_APP}chantdb.php`
export const API_CHANT_DB_READ = `${HOST_APP}chantdbread.php`
export const API_CHANT_AUTH = `${HOST}/control.php`

export {
  RFReactMultiSelect,
  RFReactSelect,
  Loading,
  Header,
  getPageNum,
  Select,
  getPaperItem,
}

export const getDataFromServer = async (url) => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await resp.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; // Можно выбросить ошибку или вернуть значение по умолчанию
  }
}

export const getDate = () => {
  const today = new Date()
  return `${String(today.getMonth() + 1).padStart(2, '0')}.${String(
    today.getDate(),
  ).padStart(2, '0')}.${today.getFullYear()}`
}

export const mezenets = (text) => {
if (!text || !zfarr || !zfarr.length) return "";

  const excludedMarkers = [
     'Э---+','Э--+','Э-+','Э-++','Э-;','Э!-','Э---','Э--','Э-','Э:',
    'ъК,','ъК.','ъК','К,','ъТ','Т+++','Т++','Т--/','Т---','Т--','Т,','**/:','**/',
    '_"/','*х/:~','*х/.~','*х/~','*х/%','*х/:','*х/.','*х/,','*х/','*/',
    'х/,','х/.~','х/~','х/.','х/','х/%','х/:','"/%','"/:','//.','//:'
  ];

  const forbiddenTails = ['о', ',', '_+'];

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let combined = zfarr.map((val, i) => ({ zf: val, m: marr[i] }));
  combined.sort((a, b) => b.zf.length - a.zf.length);
  
  const sortedZf = combined.map(item => item.zf);
  const markerLookup = new Map(combined.map(item => [item.zf, item.m]));
  const createLookup = (zf, m) => {
    if (!zf || !zf.length) return { regex: null, map: new Map() };
    const sorted = [...zf].sort((a, b) => b.length - a.length);
    return {
      regex: new RegExp(`(${sorted.map(esc).join('|')})`, 'gu'),
      map: new Map(zf.map((val, i) => [val, m[i]]))
    };
  };

  const tails = createLookup(zftail, mtail);
  const heads = createLookup(zfhead, mhead);
  const veryTails = createLookup(zfverytail, mverytail);

  // --- 3. РАЗБИЕНИЕ СТРОКИ ---
  const markerRegex = new RegExp(`(${sortedZf.map(esc).join('|')})`, 'u');
  const allParts = text.split(markerRegex);
  
  const textParts = [];
  const foundZfKeys = [];

  for (let i = 0; i < allParts.length; i++) {
    if (i % 2 === 0) {
      textParts.push(allParts[i]);
    } else {
      foundZfKeys.push(allParts[i]);
    }
  }

  let finalString = "";

  foundZfKeys.forEach((zfKey, i) => {
    const leftText = textParts[i] || "";
    const rightText = textParts[i + 1] || "";
    finalString += markerLookup.get(zfKey) || "";
    let hasForbiddenTail = false;
    if (rightText && tails.regex) {
      const matchedTails = rightText.match(tails.regex);
      if (matchedTails && matchedTails.some(t => forbiddenTails.includes(t))) {
        hasForbiddenTail = true;
      }
    }

    // Модификаторы
    if (/[КЩТ/=Э]/.test(zfKey) && !excludedMarkers.includes(zfKey) && !hasForbiddenTail) {
      if (/[НП]/i.test(leftText)) finalString += '𜽂';
      else if (/[ЦСВ]/i.test(leftText)) finalString += '𜽃';
    }

    // tails
    if (rightText && tails.regex) {
      const parts = rightText.split(tails.regex);
      parts.forEach(p => {
        if (tails.map.has(p)) finalString += tails.map.get(p);
      });
    }

    // heads
    if (leftText && heads.regex) {
      const parts = leftText.split(heads.regex);
      parts.forEach(p => {
        if (heads.map.has(p)) finalString += heads.map.get(p);
      });
    }

    if (i === foundZfKeys.length - 1) {
      if (rightText && veryTails.regex) {
        const matchedVT = rightText.match(veryTails.regex);
        if (matchedVT) {
          matchedVT.forEach(m => {
            if (veryTails.map.has(m)) finalString += veryTails.map.get(m);
          });
        }
      }
    }
  });

  return finalString;
};

export const focusActiveInput = (isOptionsMode, isPitchMode) => {
  setTimeout(() => {
    let id = "symbol-name-select";

    if (isOptionsMode && !isPitchMode) {
      id = "symbol-options-select";
    } else if (isPitchMode) {
      id = "symbol-pitch-select";
    }

    const container = document.getElementById(id).focus();
  }, 10);
};


export const ucsToUnicode = (rawText) => {
  if (!rawText) return '';
  
  let text = rawText;

  const batchReplace = (str, findArray, replaceArray) => {
    let result = str;
    for (let i = 0; i < findArray.length; i++) {
      const find = findArray[i];
      const replace = replaceArray[i];
      const escapedFind = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedFind, 'g');
      result = result.replace(regex, replace);
    }
    return result;
  };
  
  return batchReplace(text,
    ['Е','У','Ш','З','Ф','П','О','Э','я','Я','И','Ю'],
    ['ѣ','ѹ','ѡ','ѕ','ѳ','ѱ','ꙍ','є','ꙗ','ѧ','ї','ꙋ']
  );
};


export const unicodeSlavonic = (rawText) => {
  if (!rawText) return '';
  const dictionary = {
    // 1. Надстрочные буквы
    '//б': 'ⷠ҇', '//в': 'ⷡ҇', '//г': 'ⷢ҇', '//д': 'ⷣ', '//ж': 'ⷤ', '//з': 'ⷥ', 
    '//к': 'ⷦ҇', '//л': 'ⷧ҇', '//м': 'ⷨ', '//н': 'ⷩ҇', '//о': 'ⷪ҇', '//п': 'ⷫ҇', 
    '//р': 'ⷬ҇', '//с': 'ⷭ҇', '//т': 'ⷮ', '//х': 'ⷯ', '//ц': 'ⷰ҇', '//ч': 'ⷱ҇', 
    '//ш': 'ⷲ҇', '//щ': 'ⷳ҇', '//f': 'ⷴ', '//_ф': 'ⷴ', '//а': 'ⷶ', '//е': 'ⷷ҇', 
    '//у': 'ⷹ', '//ё': 'ⷺ', '//ja': 'ⷼ', '//_я': 'ⷼ', '//я': 'ⷽ҇',
    // 2. Разновидности е
    'ё': 'ѣ', 'Ё': 'Ѣ', '_е': 'є', 'э': 'є', 'Э': 'Є', '_Е': 'Є', 'jе': 'ѥ', '*е': 'ѥ', '*Е': 'Ѥ',
    // 3. Разновидности и
    '_i': 'ї', '_I': 'Ї', '*и': 'ї', '*И': 'Ї', 'i': 'і', 'I': 'і', '*й': 'І', '*Й': 'і',
    // 4. Разновидности ижицы
    '_и': 'ѷ', '_И': 'Ѷ', '_v"': 'ѷ', '_V"': 'Ѷ', "_и'": 'ѵ́', "И'": 'Ѵ́', "_v'": 'ѵ́', "V'": 'Ѵ́', '_в': 'ѵ', '_В': 'Ѵ',
    // 5. Разновидности а, я
    'jя': 'ѩ', '*я': 'ѩ', 'Jя': 'Ѩ', '*Я': 'Ѩ', 'ja': 'ꙗ', '_я': 'ꙗ', 'Ja': 'Ꙗ', '_Я': 'Ꙗ', 'я': 'ѧ', 'Я': 'Ѧ',
    // 6. Разновидности у
    'о_у': 'ѹ', 'О_у': 'Ѹ', '_ꙋ': 'у', '_У': 'У', '*ю': 'ѭ', '*Ю': 'Ѩ', 'ju': 'ѭ', '_ю': 'ѫ', '_Ю': 'Ѫ', 'u': 'ѫ', 'U': 'Ѫ', 'у': 'ꙋ',
    // 7. Разновидности о и омеги
    'w\\т': 'ѿ', '*о\\т': 'ѿ', 'W\\т': 'Ѿ', '*О\\т': 'Ѿ', '*о': 'ѡ', '*О': 'Ѡ', 'w': 'ѡ', 'W': 'Ѡ', '_о': 'ѻ', '_О': 'Ѻ', '_*о': 'ꙍ', '_w': 'ꙍ', '_*О': 'Ꙍ', '_W': 'Ꙍ',
    // 8. Согласные
    '_кс': 'ѯ', '_Кс': 'Ѯ', '_пс': 'ѱ', '_Пс': 'Ѱ', '_з': 'ѕ', '_З': 'Ѕ', 's': 'ѕ', 'S': 'Ѕ', '_ф': 'ѳ', 'Ф': 'Ѳ', 'f': 'ѳ', 'F': 'Ѳ',
    // 9. Надстрочные знаки
    "='": '҆́', "=`": '҆̀', "'": '́', '`': '̀', '^': '̑', '=': '҆', '~': '҃', '\\ъ': '̾', '\\': '҇'
  };

  const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
  const regexPattern = sortedKeys.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(regexPattern, 'g');
  let processedText = rawText.replace(regex, (matched) => dictionary[matched]);
  processedText = processedText.replace(/\{([^{}]+)\}/g, '<span style="color:red">$1</span>');
  return processedText;
  
};

export const zfarr=['ъК,','ъК.','ъК','К!-','К:,','К.,','К,','К.','К:','К%','Кх.','Кх','К','А','Щ','ъТ','Т.','Т+++','Т++','Т--/','Т---','Т--','Т,','Т','_"/','_%`/','_:`/','_.`/','_`/','_./:','_/:','_/.',',,:/',',,%/',',,/:',',,/',',+%/',',+:/',',+./',',+/:',',+/','**./+','**./:','**/:','**/','_./+','_:/+','_%/+','_./','_:/','_%/','_/','=:','=,','=+','=.~','=~','=ч.','=.ч','=ч','=.','=','ЗЗ//','//.','//:','//','Ч.','Ч','Р','*х/:~','*х/.~','*х/~','*х/%','*х/:','*х/.','*х/,','*х/','*/','х/,','х/.~','х/~','х/.','х/','х/%','х/:','"/%','"/:','./%','/.','!/:','/:','/%','%/ч',':/ч','./ч','/ч','Д.','Д,','Д\'','Д+','ДЭ','Д','Э---+','Э--+','Э-+','Э-++','Э-;','Э!-','Э---','Э--','Э-','Э:','Э','Ф','=З','З','Х',':У','У','О','N','С'];
export const marr=['𜽕𜼾','𜽕𜼰','𜽕','𜽑','𜽐𜼾𜼱','𜽐𜼾𜼰','𜽐𜼾','𜽐𜼰','𜽐𜼱','𜽐𜼲','𜽔𜼰','𜽔','𜽐','𜽒','𜽓','𜽚','𜽗','𜽖𜾁𜾁𜾁','𜽖𜾁𜾁','𜾰','𜽙','𜽘','𜽛','𜽖','𜾛','𜾓𜼲','𜾓𜼱','𜾓𜼰','𜾚','𜾖𜼰','𜾖','𜾕','𜾢𜼱','𜾢𜼲','𜾣','𜾢','𜾥𜼲','𜾥𜼱','𜾥𜼰','𜾦','𜾥','𜾮𜼰','𜾭𜼰','𜾭','𜾬','𜾔𜼰','𜾔𜼱','𜾔𜼲','𜾒𜼰','𜾒𜼱','𜾒𜼲','𜾒','𜾆𜼱','𜾇','𜾈','𜾋𜼰','𜾋','𜾐𜼰','𜾐𜼰','𜾐','𜾆𜼰','𜾆','𜽭','𜽜𜼳','𜽜𜼽','𜽜','𜽯𜼼','𜽯','𜾂','𜾩𜼱𜼼','𜾩𜼰𜼼','𜾩𜼼','𜾫','𜾪','𜾩𜼰','𜾩𜼾','𜾩','𜾧','𜽵𜼾','𜽵𜼰𜼼','𜽵𜼼','𜽵𜼰','𜽵','𜽷','𜽶','𜽻','𜽺','𜽳𜼰','𜽱','𜽴','𜽲','𜽳','𜽰𜼲','𜽰𜼱','𜽰𜼰','𜽰','𜽿','𜽾','𜽽𜼬','𜾀','𜽽𜽝','𜽽','𜽢𜾁','𜽡𜾁','𜽠𜾁','𜽠𜾁𜾁','𜽤','𜽟','𜽢','𜽡','𜽠','𜽞','𜽝','𜾃','𜾆𜾅','𜾅','𜽮','𜾆𜿃','𜿃','𜿁','𜿂','𜾄'];
export const zfhead=['г#','Г#','н#','Н#','ц#','с#','м#','п#','в#','М#','П#','В#','г@','Г@','н@','Н@','ц@','с@','м@','п@','в@','М@','П@','В@','*г','Г','*н','Н','ц','г','н','с','м','п','в','*м','М','*п','П','*в','В','р','т','б','у','л','к'];
export const mhead=['𜼀','𜼀','𜼁','𜼁','𜼘','𜼅','𜼙','𜼛','𜼝','𜼛','𜼝','𜼝','𜼅𜼃','𜼅𜼃','𜼅𜼄','𜼅𜼄','𜼅','𜼞','𜼚','𜼜','𜼟','𜼚','𜼜','𜼟','𜼀','𜼀','𜼁','𜼁','𜼂','𜼃','𜼄','𜼅','𜼆','𜼇','𜼈','𜼉','𜼉','𜼊','𜼊','𜼋','𜼋','𜼢','𜼣','𜼤','𜼥','𜼧','𜼨'];
export const zftail=['-','!','ч','о','ш','_+','+','?',',','з'];
export const mtail=['𜼳','𜼵','𜼶','𜼺','𜼻','𜽀','𜽀','𜼦','𜼿','𜼪'];
export const zfverytail=['*г','Г','*н','Н','ц','г','н','с','м','п','в','*м','М','*п','П','*в','В'];
export const mverytail=['𜼌','𜼌','𜼍','𜼍','𜼎','𜼏','𜼐','𜼑','𜼒','𜼓','𜼔','𜼕','𜼕','𜼖','𜼖','𜼗','𜼗'];

export const PITCH_MAP = {
  'Г': 'G4', 'Н': 'A4', 'ц': 'B4', // Нижние
  'г': 'C5', 'н': 'D5', 'с': 'E5', 'м': 'F5', 'п': 'G5', 'в': 'A5', 'М': 'Bb5', // Средние
  'П': 'C6', 'В': 'D6' // Верхние
};

export const DURATION_MAP = {
  '4': 4,   // целая
  '2': 2,   // половина
  '1': 1,   // четвертая
  '!': 0.5, // восьмая
  '3': 3,   // три четверти
  '5': 1.5  // три восьмых (0.5 * 3)
};
