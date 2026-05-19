const OURMANNA_URL = "https://beta.ourmanna.com/api/v1/get/?format=json&order=daily";
const ESBIBLIA_BASE_URL = "https://esbiblia.net/api";
const ESBIBLIA_VERSION = "rva";

type OurMannaResponse = {
  verse?: {
    details?: {
      text?: string;
      reference?: string;
    };
  };
};

type EsBibliaResponse = {
  verses?: Array<{
    book_name?: string;
    chapter?: number;
    verse?: number;
    text?: string;
  }>;
};

export type VerseOfTheDay = {
  verse: string;
  reference: string;
};

const BOOK_ALIASES: Record<string, string> = {
  GENESIS: "GEN",
  EXODUS: "EXO",
  LEVITICUS: "LEV",
  NUMBERS: "NUM",
  DEUTERONOMY: "DEU",
  JOSHUA: "JOS",
  JUDGES: "JDG",
  RUTH: "RUT",
  SAMUEL: "1SA",
  SAMUEL2: "2SA",
  KINGS: "1KI",
  KINGS2: "2KI",
  CHRONICLES: "1CH",
  CHRONICLES2: "2CH",
  EZRA: "EZR",
  NEHEMIAH: "NEH",
  ESTHER: "EST",
  JOB: "JOB",
  PSALM: "PSA",
  PSALMS: "PSA",
  PROVERBS: "PRO",
  ECCLESIASTES: "ECC",
  SONGOFSOLOMON: "SNG",
  SONGOFSONGS: "SNG",
  SONG: "SNG",
  ISAIAH: "ISA",
  JEREMIAH: "JER",
  LAMENTATIONS: "LAM",
  EZEKIEL: "EZE",
  DANIEL: "DAN",
  HOSEA: "HOS",
  JOEL: "JOL",
  AMOS: "AMO",
  OBADIAH: "OBA",
  JONAH: "JON",
  MICAH: "MIC",
  NAHUM: "NAM",
  HABAKKUK: "HAB",
  ZEPHANIAH: "ZEP",
  HAGGAI: "HAG",
  ZECHARIAH: "ZEC",
  MALACHI: "MAL",
  MATTHEW: "MAT",
  MARK: "MRK",
  LUKE: "LUK",
  JOHN: "JHN",
  ACTS: "ACT",
  ROMANS: "ROM",
  "1CORINTHIANS": "1CO",
  "2CORINTHIANS": "2CO",
  GALATIANS: "GAL",
  EPHESIANS: "EPH",
  PHILIPPIANS: "PHP",
  COLOSSIANS: "COL",
  "1THESSALONIANS": "1TH",
  "2THESSALONIANS": "2TH",
  "1TIMOTHY": "1TI",
  "2TIMOTHY": "2TI",
  TITUS: "TIT",
  PHILEMON: "PHM",
  HEBREWS: "HEB",
  JAMES: "JAS",
  "1PETER": "1PE",
  "2PETER": "2PE",
  "1JOHN": "1JN",
  "2JOHN": "2JN",
  "3JOHN": "3JN",
  JUDE: "JUD",
  REVELATION: "REV",
  "1SAMUEL": "1SA",
  "2SAMUEL": "2SA",
  "1KINGS": "1KI",
  "2KINGS": "2KI",
  "1CHRONICLES": "1CH",
  "2CHRONICLES": "2CH",
};

function normalizeBookKey(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function splitReference(reference: string) {
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);

  if (!match) {
    return null;
  }

  return {
    bookName: match[1].trim(),
    chapter: Number(match[2]),
    verse: Number(match[3]),
    verse2: match[4] ? Number(match[4]) : undefined,
  };
}

function getBookCode(bookName: string) {
  const normalized = normalizeBookKey(bookName);

  if (BOOK_ALIASES[normalized]) {
    return BOOK_ALIASES[normalized];
  }

  return null;
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) {
    return null as T | null;
  }

  return (await response.json()) as T;
}

async function translateVerseToSpanish(reference: string) {
  const parsed = splitReference(reference);

  if (!parsed) {
    return null;
  }

  const bookCode = getBookCode(parsed.bookName);

  if (!bookCode) {
    return null;
  }

  const url = new URL(`${ESBIBLIA_BASE_URL}/view/${bookCode}/${parsed.chapter}/${parsed.verse}/`);
  url.searchParams.set("v", ESBIBLIA_VERSION);
  if (parsed.verse2) {
    url.pathname = `/api/view/${bookCode}/${parsed.chapter}/${parsed.verse}/${parsed.verse2}/`;
  }

  const payload = await fetchJson<EsBibliaResponse>(url.toString());
  const verse = payload?.verses?.[0];

  if (!verse?.text) {
    return null;
  }

  const suffix = parsed.verse2 ? `-${parsed.verse2}` : "";
  const referenceEs = `${verse.book_name ?? parsed.bookName} ${parsed.chapter}:${parsed.verse}${suffix}`;

  return {
    verse: verse.text,
    reference: referenceEs,
  };
}

export async function getVerseOfTheDay(): Promise<VerseOfTheDay | null> {
  try {
    const response = await fetch(OURMANNA_URL, {
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as OurMannaResponse;
    const reference = payload.verse?.details?.reference ?? "";

    if (!reference) {
      return null;
    }

    const spanishVerse = await translateVerseToSpanish(reference);

    if (spanishVerse) {
      return spanishVerse;
    }

    return null;
  } catch {
    return null;
  }
}
