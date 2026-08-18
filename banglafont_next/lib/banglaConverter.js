const conversions = { "।" : "|", "‘":"Ô", "’":"Õ", "“":"Ò", "”":"Ó", "্র্য":"ª¨", "ম্প্র":"¤cÖ", "র‌্য":"i¨", "ক্ষ্ম":"²", "ক্ক":"°", "ক্ট":"±", "ক্ত":"³", "ক্ব":"K¡", "স্ক্র":"¯Œ", "ক্র":"µ", "ক্ল":"K¬", "ক্ষ":"¶", "ক্স":"·", "গু":"¸", "গ্ধ":"»", "গ্ন":"Mœ", "গ্ম":"M¥", "গ্ল":"Mø", "গ্রু":"Mªy", "ঙ্ক":"¼", "ঙ্ক্ষ":"•¶", "ঙ্খ":"•L", "ঙ্গ":"½", "ঙ্ঘ":"•N", "চ্ছ্ব":"”Q¡", "চ্চ":"”P", "চ্ছ":"”Q", "চ্ঞ":"”T", "জ্জ্ব":"¾¡", "জ্জ":"¾", "জ্ঝ":"À", "জ্ঞ":"Á", "জ্ব":"R¡", "ঞ্চ":"Â", "ঞ্ছ":"Ã", "ঞ্জ":"Ä", "ঞ্ঝ":"Å", "ট্ট":"Æ", "ট্ব":"U¡", "ট্ম":"U¥", "ড্ড":"Ç", "ণ্ট":"È", "ণ্ঠ":"É", "ন্স":"Ý", "ণ্ড":"Ê", "ন্তু":"š‘", "ণ্ব":"Y^", "ত্ত্ব":"Ë¡", "ত্ত":"Ë", "ত্থ":"Ì", "ত্ন":"Zœ", "ত্ম":"Z¥", "ন্ত্ব":"š—¡", "ত্ব":"Z¡", "থ্ব":"_¡", "দ্গ":"˜M", "দ্ঘ":"˜N", "দ্দ":"Ï", "দ্ধ":"×", "দ্ব":"˜¡", "দ্ব":"Ø", "দ্ভ":"™¢", "দ্ম":"Ù", "দ্রু":"`ª“", "ধ্ব":"aŸ", "ধ্ম":"a¥", "ন্ট":"›U", "ন্ঠ":"Ú", "ন্ড":"Û", "ন্ত্র":"š¿", "ন্ত":"š—", "স্ত্র":"¯¿", "ত্র":"Î", "ন্থ":"š’", "ন্দ":"›`", "ন্দ্ব":"›Ø", "ন্ধ":"Ü", "ন্ন":"bœ", "ন্ব":"š^", "ন্ম":"b¥", "প্ট":"Þ", "প্ত":"ß", "প্ন":"cœ", "প্প":"à", "প্ল":"cø", "প্স":"á", "ফ্ল":"d¬", "ব্জ":"â", "ব্দ":"ã", "ব্ধ":"ä", "ব্ব":"eŸ", "ব্ল":"eø", "ভ্র":"å", "ম্ন":"gœ", "ম্প":"¤ú", "ম্ফ":"ç", "ম্ব":"¤^", "ম্ভ":"¤¢", "ম্ভ্র":"¤£", "ম্ম":"¤§", "ম্ল":"¤ø", "্র":"ª", "রু":"i“", "রূ":"iƒ", "ল্ক":"é", "ল্গ":"ê", "ল্ট":"ë", "ল্ড":"ì", "ল্প":"í", "ল্ফ":"î", "ল্ব":"j¦", "ল্ম":"j¥", "ল্ল":"jø", "শু":"ï", "শ্চ":"ð", "শ্ন":"kœ", "শ্ব":"k¦", "শ্ম":"k¥", "শ্ল":"kø", "ষ্ক":"®‹", "ষ্ক্র":"®Œ", "ষ্ট":"ó", "ষ্ঠ":"ô", "ষ্ণ":"ò", "ষ্প":"®ú", "ষ্ফ":"õ", "ষ্ম":"®§", "স্ক":"¯‹", "স্ট":"÷", "স্খ":"ö", "স্ত":"¯Í", "স্তু":"¯‘", "স্থ":"¯’", "স্ন":"mœ", "স্প":"¯ú", "স্ফ":"ù", "স্ব":"¯^", "স্ম":"¯§", "স্ল":"¯ø", "হু":"û", "হ্ণ":"nè", "হ্ব":"nŸ", "হ্ন":"ý", "হ্ম":"þ", "হ্ল":"n¬", "হৃ":"ü", "র্":"©", "্র":"«", "্য":"¨", "্":"&", "আ":"Av", "অ":"A", "ই":"B", "ঈ":"C", "উ":"D", "ঊ":"E", "ঋ":"F", "এ":"G", "ঐ":"H", "ও":"I", "ঔ":"J", "ক":"K", "খ":"L", "গ":"M", "ঘ":"N", "ঙ":"O", "চ":"P", "ছ":"Q", "জ":"R", "ঝ":"S", "ঞ":"T", "ট":"U", "ঠ":"V", "ড":"W", "ঢ":"X", "ণ":"Y", "ত":"Z", "থ":"_", "দ":"`", "ধ":"a", "ন":"b", "প":"c", "ফ":"d", "ব":"e", "ভ":"f", "ম":"g", "য":"h", "র":"i", "ল":"j", "শ":"k", "ষ":"l", "স":"m", "হ":"n", "ড়":"o", "ঢ়":"p", "য়":"q", "ৎ":"r", "০":"0", "১":"1", "২":"2", "৩":"3", "৪":"4", "৫":"5", "৬":"6", "৭":"7", "৮":"8", "৯":"9", "া":"v", "ি":"w", "ী":"x", "ু":"y", "ূ":"~", "ৃ":"…", "ে":"‡", "ো":"‡", "ৈ":"‰", "ৗ":"Š", "ৌ": "Š", "ং":"s", "ঃ":"t", "ঁ":"u", "্ল": "ø" };

const bengaliRegex = /(র্){0,1}([অ-হড়-য়](?:্[অ-মশ-হড়-য়])*)((‍){0,1}(্[য-ল])){0,1}([া-ৌ]){0,1}|[্ঁঃংৎ০-৯]/g;

function replacer(match, reff, mUnit, posPhala, noPrint, posPhalaTrail, kaar, offset, string) {
  if (conversions[match]) {
    return conversions[match];
  }
  var mainConv, kaarConv;
  if (posPhala) {
    mainConv = mUnit.replace(bengaliRegex, replacer) + conversions[posPhalaTrail];
  } else {
    mainConv = mUnit.replace(bengaliRegex, replacer);
  }
  if (reff) {
    mainConv = mainConv + '©';
  }
  if (kaar) {
    kaarConv = conversions[kaar];
    if (kaar.match(/[াীুূৗৃ]/)) {
      mainConv = mainConv + kaarConv;
    } else if (kaar.match(/[িেৈ]/)) {
      mainConv = kaarConv + mainConv;
    } else {
      mainConv = kaarConv + mainConv + "v";
    }
    if (kaar.match(/[েো]/) && (offset == 0 || string[offset - 1] == ' ')) {
      mainConv = mainConv.replace("‡", '†');
    }
  }
  return mainConv;
}

export function unicodeToAnsi(string) {
  if (!string) return "";
  return string.replace(bengaliRegex, replacer);
}

const buildMap = (raw) => Object.entries(raw).map(([k, v]) => [
  new RegExp(escapeForRegex(k), "g"),
  v
]);

function escapeForRegex(literal) {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const preConversionMap = buildMap({
  "  ": " ",
  yy: "y",
  vv: "v",
  "\xAD\xAD": "\xAD",
  "y&": "y",
  "\u201E&": "\u201E",
  "\u2021u": "u\u2021",
  wu: "uw",
  " ,": ",",
  " |": "|",
  "\\ ": "",
  " \\": "",
  "\\": "",
  "\n ": "\n",
  " \n": "\n",
  "\n\n\n\n\n": "\n\n",
  "\n\n\n\n": "\n\n",
  "\n\n\n": "\n\n"
});

const conversionMap = buildMap({
  "i\xE6": "\u09B0\u09C1",
  "i\u201C": "\u09B0\u09C1",
  "i\u0192": "\u09B0\u09C2",
  "M\xF8": "\u0997\u09CD\u09B2",
  "\u201DQ\xA6": "\u099A\u09CD\u099B\u09CD\u09AC",
  "c\xF8": "\u09AA\u09CD\u09B2",
  "e\xF8": "\u09AC\u09CD\u09B2",
  "k\xF8": "\u09B6\u09CD\u09B2",
  "\xA4\xF8": "\u09AE\u09CD\u09B2",
  "\xAF\xF8": "\u09B8\u09CD\u09B2",
  "\xE5\u201C": "\u09AD\u09CD\u09B0\u09C1",
  "\xAF\xCD": "\u09B8\u09CD\u09A4",
  "\u0161\xCD": "\u09A8\u09CD\u09A4",
  "\xAF\xCD\xA1": "\u09B8\u09CD\u09A4\u09CD\u09AC",
  "\u0161\xCD\xA1": "\u09A8\u09CD\u09A4\u09CD\u09AC",
  "\xCB\xA1": "\u09A4\u09CD\u09A4\u09CD\u09AC",
  "\\\\": "\u0965",
  Av: "\u0986",
  A: "\u0985",
  B: "\u0987",
  C: "\u0988",
  D: "\u0989",
  E: "\u098A",
  F: "\u098B",
  G: "\u098F",
  H: "\u0990",
  I: "\u0993",
  J: "\u0994",
  K: "\u0995",
  L: "\u0996",
  M: "\u0997",
  N: "\u0998",
  O: "\u0999",
  P: "\u099A",
  Q: "\u099B",
  R: "\u099C",
  S: "\u099D",
  T: "\u099E",
  U: "\u099F",
  V: "\u09A0",
  W: "\u09A1",
  X: "\u09A2",
  Y: "\u09A3",
  Z: "\u09A4",
  _: "\u09A5",
  "`": "\u09A6",
  a: "\u09A7",
  b: "\u09A8",
  c: "\u09AA",
  d: "\u09AB",
  e: "\u09AC",
  f: "\u09AD",
  g: "\u09AE",
  h: "\u09AF",
  i: "\u09B0",
  j: "\u09B2",
  k: "\u09B6",
  l: "\u09B7",
  m: "\u09B8",
  n: "\u09B9",
  o: "\u09DC",
  p: "\u09DD",
  q: "\u09DF",
  r: "\u09CE",
  s: "\u0982",
  t: "\u0983",
  u: "\u0981",
  "0": "\u09E6",
  "1": "\u09E7",
  "2": "\u09E8",
  "3": "\u09E9",
  "4": "\u09EA",
  "5": "\u09EB",
  "6": "\u09EC",
  "7": "\u09ED",
  "8": "\u09EE",
  "9": "\u09EF",
  "\u2022": "\u0999\u09CD",
  v: "\u09BE",
  w: "\u09BF",
  x: "\u09C0",
  y: "\u09C1",
  z: "\u09C1",
  "\u201C": "\u09C1",
  "\u2013": "\u09C1",
  "~": "\u09C2",
  "\u0192": "\u09C2",
  "\u201A": "\u09C2",
  "\u201E\u201E": "\u09C3",
  "\u201E": "\u09C3",
  "\u2026": "\u09C3",
  "\u2020": "\u09C7",
  "\u2021": "\u09C7",
  "\u02C6": "\u09C8",
  "\u2030": "\u09C8",
  "\u0160": "\u09D7",
  "|": "\u0964",
  "&": "\u09CD\u200C",
  "^": "\u09CD\u09AC",
  "\u2018": "\u09CD\u09A4\u09C1",
  "\u2019": "\u09CD\u09A5",
  "\u2039": "\u09CD\u0995",
  "\u0152": "\u09CD\u0995\u09CD\u09B0",
  "\u201D": "\u099A\u09CD",
  "\u2014": "\u09CD\u09A4",
  "\u02DC": "\u09A6\u09CD",
  "\u2122": "\u09A6\u09CD",
  "\u0161": "\u09A8\u09CD",
  "\u203A": "\u09A8\u09CD",
  "\u0153": "\u09CD\u09A8",
  "\u0178": "\u09CD\u09AC",
  "\xA1": "\u09CD\u09AC",
  "\xA2": "\u09CD\u09AD",
  "\xA3": "\u09CD\u09AD\u09CD\u09B0",
  "\xA4": "\u09AE\u09CD",
  "\xA5": "\u09CD\u09AE",
  "\xA6": "\u09CD\u09AC",
  "\xA7": "\u09CD\u09AE",
  "\xA8": "\u09CD\u09AF",
  "\xA9": "\u09B0\u09CD",
  "\xAA": "\u09CD\u09B0",
  "\xAB": "\u09CD\u09B0",
  "\xAC": "\u09CD\u09B2",
  "\xAD": "\u09CD\u09B2",
  "\xAE": "\u09B7\u09CD",
  "\xAF": "\u09B8\u09CD",
  "\xB0": "\u0995\u09CD\u0995",
  "\xB1": "\u0995\u09CD\u099F",
  "\xB2": "\u0995\u09CD\u09B7\u09CD\u09A3",
  "\xB3": "\u0995\u09CD\u09A4",
  "\xB4": "\u0995\u09CD\u09AE",
  "\xB5": "\u0995\u09CD\u09B0",
  "\xB6": "\u0995\u09CD\u09B7",
  "\xB7": "\u0995\u09CD\u09B8",
  "\xB8": "\u0997\u09C1",
  "\xB9": "\u099C\u09CD\u099E",
  "\xBA": "\u0997\u09CD\u09A6",
  "\xBB": "\u0997\u09CD\u09A7",
  "\xBC": "\u0999\u09CD\u0995",
  "\xBD": "\u0999\u09CD\u0997",
  "\xBE": "\u099C\u09CD\u099C",
  "\xBF": "\u09CD\u09A4\u09CD\u09B0",
  "\xC0": "\u099C\u09CD\u099D",
  "\xC1": "\u099C\u09CD\u099E",
  "\xC2": "\u099E\u09CD\u099A",
  "\xC3": "\u099E\u09CD\u099B",
  "\xC4": "\u099E\u09CD\u099C",
  "\xC5": "\u099E\u09CD\u099D",
  "\xC6": "\u099F\u09CD\u099F",
  "\xC7": "\u09A1\u09CD\u09A1",
  "\xC8": "\u09A3\u09CD\u099F",
  "\xC9": "\u09A3\u09CD\u09A0",
  "\xCA": "\u09A3\u09CD\u09A0",
  "\xCB": "\u09A4\u09CD\u09A4",
  "\xCC": "\u09A4\u09CD\u09A5",
  "\xCD": "\u09A4\u09CD\u09AE",
  "\xCE": "\u09A4\u09CD\u09B0",
  "\xCF": "\u09A6\u09CD\u09A6",
  "\xD7": "\u09A6\u09CD\u09A7",
  "\xD8": "\u09A6\u09CD\u09AC",
  "\xD9": "\u09A6\u09CD\u09AE",
  "\xDA": "\u09A8\u09CD\u09A0",
  "\xDB": "\u09A8\u09CD\u09A1",
  "\xDC": "\u09A8\u09CD\u09A7",
  "\xDD": "\u09A8\u09CD\u09B8",
  "\xDE": "\u09AA\u09CD\u099F",
  "\xDF": "\u09AA\u09CD\u09A4",
  "\xE0": "\u09AA\u09CD\u09AA",
  "\xE1": "\u09AA\u09CD\u09B8",
  "\xE2": "\u09AC\u09CD\u099C",
  "\xE3": "\u09AC\u09CD\u09A6",
  "\xE4": "\u09AC\u09CD\u09A7",
  "\xE5": "\u09AD\u09CD\u09B0",
  "\xE6": "\u09C1",
  "\xE7": "\u09AE\u09CD\u09AB",
  "\xE8": "\u09CD\u09A8",
  "\xE9": "\u09B2\u09CD\u0995",
  "\xEA": "\u09B2\u09CD\u0997",
  "\xEB": "\u09B2\u09CD\u099F",
  "\xEC": "\u09B2\u09CD\u09A1",
  "\xED": "\u09B2\u09CD\u09AA",
  "\xEE": "\u09B2\u09CD\u09AB",
  "\xEF": "\u09B6\u09C1",
  "\xF0": "\u09B6\u09CD\u099A",
  "\xF1": "\u09B6\u09CD\u099B",
  "\xF2": "\u09B7\u09CD\u09A3",
  "\xF3": "\u09B7\u09CD\u099F",
  "\xF4": "\u09B7\u09CD\u09A0",
  "\xF5": "\u09B7\u09CD\u09AB",
  "\xF6": "\u09B8\u09CD\u0996",
  "\xF7": "\u09B8\u09CD\u099F",
  "\xF8": "\u09B8\u09CD\u09A8",
  "\xF9": "\u09B8\u09CD\u09AB",
  "\xFA": "\u09CD\u09AA",
  "\xFB": "\u09B9\u09C1",
  "\xFC": "\u09B9\u09C3",
  "\xFD": "\u09B9\u09CD\u09A8",
  "\xFE": "\u09B9\u09CD\u09AE",
  "\xFF": "\u0995\u09CD\u09B7"
});

const proConversionMap = buildMap({
  "\u09CD\u09CD": "\u09CD"
});

const postConversionMap = buildMap({
  "\u09E6\u0983": "\u09E6:",
  "\u09E7\u0983": "\u09E7:",
  "\u09E8\u0983": "\u09E8:",
  "\u09E9\u0983": "\u09E9:",
  "\u09EA\u0983": "\u09EA:",
  "\u09EB\u0983": "\u09EB:",
  "\u09EC\u0983": "\u09EC:",
  "\u09ED\u0983": "\u09ED:",
  "\u09EE\u0983": "\u09EE:",
  "\u09EF\u0983": "\u09EF:",
  " \u0983": ":",
  "\n\u0983": "\n:",
  "]\u0983": "]:",
  "[\u0983": "[:",
  "  ": " ",
  "\u0985\u09BE": "\u0986",
  "\u09CD\u200C\u09CD\u200C": "\u09CD\u200C"
});

function applyMap(text, map) {
  let out = text;
  for (const [pattern, replacement] of map) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

const HALANT = "\u09CD";
function isBanglaPreKar(c) {
  return c === "\u09BF" || c === "\u09C8" || c === "\u09C7";
}
function isBanglaPostKar(c) {
  return c === "\u09BE" || c === "\u09CB" || c === "\u09CC" || c === "\u09D7" || c === "\u09C1" || c === "\u09C2" || c === "\u09C0" || c === "\u09C3";
}
function isBanglaKar(c) {
  return isBanglaPreKar(c) || isBanglaPostKar(c);
}
function isBanglaBanjonborno(c) {
  if (!c) return false;
  return "\u0995\u0996\u0997\u0998\u0999\u099A\u099B\u099C\u099D\u099E\u099F\u09A0\u09A1\u09A2\u09A3\u09A4\u09A5\u09A6\u09A7\u09A8\u09AA\u09AB\u09AC\u09AD\u09AE\u09AF\u09B0\u09B2\u09B6\u09B7\u09B8\u09B9".includes(c) || c === "\u09A1\u09BC" || 
  c === "\u09A2\u09BC" || 
  c === "\u09AF\u09BC" || 
  c === "\u09CE" || c === "\u0982" || c === "\u0983" || c === "\u0981";
}
function isBanglaNukta(c) {
  return c === "\u0981";
}
function isBanglaHalant(c) {
  return c === HALANT;
}
function isSpace(c) {
  return c === " " || c === "	" || c === "\n" || c === "\r";
}
function charAt(s, i) {
  if (i < 0 || i >= s.length) return "";
  return s.charAt(i);
}
function rearrange(input) {
  let str = input;
  let i = 0;
  while (i < str.length) {
    if (i < str.length - 1 && charAt(str, i) === "\u09B0" && isBanglaHalant(charAt(str, i + 1)) && isBanglaHalant(charAt(str, i - 1))) {
      let j = 1;
      while (true) {
        if (i - j < 0) break;
        if (isBanglaBanjonborno(charAt(str, i - j)) && isBanglaHalant(charAt(str, i - j - 1))) {
          j += 2;
        } else if (j === 1 && isBanglaKar(charAt(str, i - j))) {
          j += 1;
        } else {
          break;
        }
      }
      str = str.slice(0, i - j) + charAt(str, i) + charAt(str, i + 1) + str.slice(i - j, i) + str.slice(i + 2);
      i += 1;
      continue;
    }
    i += 1;
  }
  i = 0;
  while (i < str.length - 1) {
    if (charAt(str, i) === "\u09B0" && isBanglaHalant(charAt(str, i + 1)) && i > 0 && 
    isBanglaBanjonborno(charAt(str, i - 1)) && !isBanglaHalant(charAt(str, i - 2)) && 
    !(isBanglaBanjonborno(charAt(str, i + 2)) && isBanglaHalant(charAt(str, i + 3)))) {
      let j = 1;
      while (true) {
        if (i - j - 1 < 0) break;
        if (isBanglaBanjonborno(charAt(str, i - j - 1)) && isBanglaHalant(charAt(str, i - j))) {
          j += 2;
        } else {
          break;
        }
      }
      str = str.slice(0, i - j) + charAt(str, i) + 
      charAt(str, i + 1) + 
      str.slice(i - j, i) + 
      str.slice(i + 2);
      i += 2;
      continue;
    }
    i += 1;
  }
  str = applyMap(str, proConversionMap);
  i = 0;
  while (i < str.length) {
    if (i < str.length - 1 && charAt(str, i) === "\u09B0" && isBanglaHalant(charAt(str, i + 1)) && !isBanglaHalant(charAt(str, i - 1)) && isBanglaHalant(charAt(str, i + 2))) {
      let j = 1;
      while (true) {
        if (i - j < 0) break;
        if (isBanglaBanjonborno(charAt(str, i - j)) && isBanglaHalant(charAt(str, i - j - 1))) {
          j += 2;
        } else if (j === 1 && isBanglaKar(charAt(str, i - j))) {
          j += 1;
        } else {
          break;
        }
      }
      str = str.slice(0, i - j) + charAt(str, i) + charAt(str, i + 1) + str.slice(i - j, i) + str.slice(i + 2);
      i += 1;
      continue;
    }
    if (i > 0 && charAt(str, i) === HALANT && (isBanglaKar(charAt(str, i - 1)) || isBanglaNukta(charAt(str, i - 1))) && i < str.length - 1) {
      str = str.slice(0, i - 1) + charAt(str, i) + charAt(str, i + 1) + charAt(str, i - 1) + str.slice(i + 2);
    }
    if (i > 0 && i < str.length - 1 && charAt(str, i) === HALANT && charAt(str, i - 1) === "\u09B0" && charAt(str, i - 2) !== HALANT && isBanglaKar(charAt(str, i + 1))) {
      str = str.slice(0, i - 1) + charAt(str, i + 1) + charAt(str, i - 1) + charAt(str, i) + str.slice(i + 2);
    }
    if (i < str.length - 1 && isBanglaPreKar(charAt(str, i)) && !isSpace(charAt(str, i + 1))) {
      let temp = str.slice(0, i);
      let j = 1;
      while (i + j < str.length - 1 && isBanglaBanjonborno(charAt(str, i + j))) {
        if (i + j < str.length && isBanglaHalant(charAt(str, i + j + 1))) {
          j += 2;
        } else {
          break;
        }
      }
      temp += str.slice(i + 1, i + j + 1);
      let l = 0;
      if (charAt(str, i) === "\u09C7" && charAt(str, i + j + 1) === "\u09BE") {
        temp += "\u09CB";
        l = 1;
      } else if (charAt(str, i) === "\u09C7" && charAt(str, i + j + 1) === "\u09D7") {
        temp += "\u09CC";
        l = 1;
      } else {
        temp += charAt(str, i);
      }
      temp += str.slice(i + j + l + 1);
      str = temp;
      i += j;
    }
    if (i < str.length - 1 && isBanglaNukta(charAt(str, i)) && isBanglaPostKar(charAt(str, i + 1))) {
      str = str.slice(0, i) + charAt(str, i + 1) + charAt(str, i) + str.slice(i + 2);
    }
    i += 1;
  }
  return str;
}

export function ansiToUnicode(src) {
  if (!src) return "";
  let out = applyMap(src, preConversionMap);
  out = applyMap(out, conversionMap);
  out = rearrange(out);
  out = applyMap(out, postConversionMap);
  return out;
}
