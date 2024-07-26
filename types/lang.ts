export type Language = {
  symbol: string;
  title: string;
  englishName: string;
  isToEnabled?: boolean;
};

export interface LangObj {
  fromLanguage: Language;
  toLanguage: Language;
}

export const LanguageOptions: Language[] = [
  {
    symbol: "EN",
    title: "English",
    englishName: "English",
    isToEnabled: true,
  },
  {
    symbol: "ZH",
    title: "中文",
    englishName: "Chinese",
  },
  {
    symbol: "DE",
    title: "Deutsch",
    englishName: "German",
    isToEnabled: true,
  },
  {
    symbol: "ES",
    title: "Español",
    englishName: "Spanish",
    isToEnabled: true,
  },
  {
    symbol: "RU",
    title: "Русский",
    englishName: "Russian",
    isToEnabled: true,
  },
  {
    symbol: "KO",
    title: "한국어",
    englishName: "Korean",
  },
  {
    symbol: "FR",
    title: "Français",
    englishName: "French",
    isToEnabled: true,
  },
  {
    symbol: "JA",
    title: "日本語",
    englishName: "Japanese",
  },
  {
    symbol: "PT",
    title: "Português",
    englishName: "Portuguese",
    isToEnabled: true,
  },
  {
    symbol: "TR",
    title: "Türkçe",
    englishName: "Turkish",
  },
  {
    symbol: "PL",
    title: "Polski",
    englishName: "Polish",
  },
  {
    symbol: "CA",
    title: "Català",
    englishName: "Catalan",
  },
  {
    symbol: "NL",
    title: "Nederlands",
    englishName: "Dutch",
    isToEnabled: true,
  },
  {
    symbol: "AR",
    title: "العربية",
    englishName: "Arabic",
  },
  {
    symbol: "SV",
    title: "Svenska",
    englishName: "Swedish",
  },
  {
    symbol: "IT",
    title: "Italiano",
    englishName: "Italian",
    isToEnabled: true,
  },
  {
    symbol: "ID",
    title: "Bahasa Indonesia",
    englishName: "Indonesian",
  },
  {
    symbol: "HI",
    title: "हिन्दी",
    englishName: "Hindi",
  },
  {
    symbol: "FI",
    title: "Suomi",
    englishName: "Finnish",
  },
  {
    symbol: "VI",
    title: "Tiếng Việt",
    englishName: "Vietnamese",
  },
  {
    symbol: "HE",
    title: "עברית",
    englishName: "Hebrew",
  },
  {
    symbol: "UK",
    title: "Українська",
    englishName: "Ukrainian",
  },
  {
    symbol: "EL",
    title: "Ελληνικά",
    englishName: "Greek",
  },
  {
    symbol: "MS",
    title: "Bahasa Melayu",
    englishName: "Malay",
  },
  {
    symbol: "CS",
    title: "Čeština",
    englishName: "Czech",
  },
  {
    symbol: "RO",
    title: "Română",
    englishName: "Romanian",
  },
  {
    symbol: "DA",
    title: "Dansk",
    englishName: "Danish",
  },
  {
    symbol: "HU",
    title: "Magyar",
    englishName: "Hungarian",
  },
  {
    symbol: "TA",
    title: "தமிழ்",
    englishName: "Tamil",
  },
  {
    symbol: "NO",
    title: "Norsk",
    englishName: "Norwegian",
  },
  {
    symbol: "TH",
    title: "ภาษาไทย",
    englishName: "Thai",
  },
  {
    symbol: "UR",
    title: "اردو",
    englishName: "Urdu",
  },
  {
    symbol: "HR",
    title: "Hrvatski",
    englishName: "Croatian",
  },
  {
    symbol: "BG",
    title: "Български",
    englishName: "Bulgarian",
  },
  {
    symbol: "LT",
    title: "Lietuvių",
    englishName: "Lithuanian",
  },
  {
    symbol: "LA",
    title: "Latin",
    englishName: "Latin",
  },
  {
    symbol: "MI",
    title: "Māori",
    englishName: "Maori",
  },
  {
    symbol: "ML",
    title: "മലയാളം",
    englishName: "Malayalam",
  },
  {
    symbol: "CY",
    title: "Cymraeg",
    englishName: "Welsh",
  },
  {
    symbol: "SK",
    title: "Slovenčina",
    englishName: "Slovak",
  },
  {
    symbol: "TE",
    title: "తెలుగు",
    englishName: "Telugu",
  },
  {
    symbol: "FA",
    title: "فارسی",
    englishName: "Persian",
  },
  {
    symbol: "LV",
    title: "Latviešu",
    englishName: "Latvian",
  },
  {
    symbol: "BN",
    title: "বাংলা",
    englishName: "Bengali",
  },
  {
    symbol: "SR",
    title: "Српски",
    englishName: "Serbian",
  },
  {
    symbol: "AZ",
    title: "Azərbaycanca",
    englishName: "Azerbaijani",
  },
  {
    symbol: "SL",
    title: "Slovenščina",
    englishName: "Slovenian",
  },
  {
    symbol: "KN",
    title: "ಕನ್ನಡ",
    englishName: "Kannada",
  },
  {
    symbol: "ET",
    title: "Eesti",
    englishName: "Estonian",
  },
  {
    symbol: "MK",
    title: "Македонски",
    englishName: "Macedonian",
  },
  {
    symbol: "BR",
    title: "Brezhoneg",
    englishName: "Breton",
  },
  {
    symbol: "EU",
    title: "Euskara",
    englishName: "Basque",
  },
  {
    symbol: "IS",
    title: "Íslenska",
    englishName: "Icelandic",
  },
  {
    symbol: "HY",
    title: "Հայերեն",
    englishName: "Armenian",
  },
  {
    symbol: "NE",
    title: "नेपाली",
    englishName: "Nepali",
  },
  {
    symbol: "MN",
    title: "Монгол",
    englishName: "Mongolian",
  },
  {
    symbol: "BS",
    title: "Bosanski",
    englishName: "Bosnian",
  },
  {
    symbol: "KK",
    title: "Қазақша",
    englishName: "Kazakh",
  },
  {
    symbol: "SQ",
    title: "Shqip",
    englishName: "Albanian",
  },
  {
    symbol: "SW",
    title: "Kiswahili",
    englishName: "Swahili",
  },
  {
    symbol: "GL",
    title: "Galego",
    englishName: "Galician",
  },
  {
    symbol: "MR",
    title: "मराठी",
    englishName: "Marathi",
  },
  {
    symbol: "PA",
    title: "ਪੰਜਾਬੀ",
    englishName: "Punjabi",
  },
  {
    symbol: "SI",
    title: "සිංහල",
    englishName: "Sinhala",
  },
  {
    symbol: "KM",
    title: "ភាសាខ្មែរ",
    englishName: "Khmer",
  },
  {
    symbol: "SN",
    title: "chiShona",
    englishName: "Shona",
  },
  {
    symbol: "YO",
    title: "Yorùbá",
    englishName: "Yoruba",
  },
  {
    symbol: "SO",
    title: "Soomaali",
    englishName: "Somali",
  },
  {
    symbol: "AF",
    title: "Afrikaans",
    englishName: "Afrikaans",
  },
  {
    symbol: "OC",
    title: "Occitan",
    englishName: "Occitan",
  },
  {
    symbol: "KA",
    title: "ქართული",
    englishName: "Georgian",
  },
  {
    symbol: "BE",
    title: "Беларуская",
    englishName: "Belarusian",
  },
  {
    symbol: "TG",
    title: "Тоҷикӣ",
    englishName: "Tajik",
  },
  {
    symbol: "SD",
    title: "سنڌي",
    englishName: "Sindhi",
  },
  {
    symbol: "GU",
    title: "ગુજરાતી",
    englishName: "Gujarati",
  },
  {
    symbol: "AM",
    title: "አማርኛ",
    englishName: "Amharic",
  },
  {
    symbol: "YI",
    title: "ייִדיש",
    englishName: "Yiddish",
  },
  {
    symbol: "LO",
    title: "ລາວ",
    englishName: "Lao",
  },
  {
    symbol: "UZ",
    title: "O'zbek",
    englishName: "Uzbek",
  },
  {
    symbol: "FO",
    title: "Føroyskt",
    englishName: "Faroese",
  },
  {
    symbol: "HT",
    title: "Kreyòl ayisyen",
    englishName: "Haitian Creole",
  },
  {
    symbol: "PS",
    title: "پښتو",
    englishName: "Pashto",
  },
  {
    symbol: "TK",
    title: "Türkmençe",
    englishName: "Turkmen",
  },
  {
    symbol: "NN",
    title: "Nynorsk",
    englishName: "Nynorsk",
  },
  {
    symbol: "MT",
    title: "Malti",
    englishName: "Maltese",
  },
  {
    symbol: "SA",
    title: "संस्कृतम्",
    englishName: "Sanskrit",
  },
  {
    symbol: "LB",
    title: "Lëtzebuergesch",
    englishName: "Luxembourgish",
  },
  {
    symbol: "MY",
    title: "မြန်မာဘाषा",
    englishName: "Myanmar",
  },
  {
    symbol: "BO",
    title: "བོད་སྐད",
    englishName: "Tibetan",
  },
  {
    symbol: "TL",
    title: "Filipino",
    englishName: "Tagalog",
  },
  {
    symbol: "MG",
    title: "Malagasy",
    englishName: "Malagasy",
  },
  {
    symbol: "AS",
    title: "অসমীয়া",
    englishName: "Assamese",
  },
  {
    symbol: "TT",
    title: "Татарча",
    englishName: "Tatar",
  },
  {
    symbol: "HAW",
    title: "ʻŌlelo Hawaiʻi",
    englishName: "Hawaiian",
  },
  {
    symbol: "LN",
    title: "Lingála",
    englishName: "Lingala",
  },
  {
    symbol: "HA",
    title: "هَوْسَ",
    englishName: "Hausa",
  },
  {
    symbol: "BA",
    title: "Башҡорт теле",
    englishName: "Bashkir",
  },
  {
    symbol: "JV",
    title: "ꦧꦱꦗꦮ",
    englishName: "Javanese",
  },
  {
    symbol: "SU",
    title: "Basa Sunda",
    englishName: "Sundanese",
  },
  {
    symbol: "YUE",
    title: "粵語",
    englishName: "Cantonese",
  },
];
