var DEBUG = false;

var TTS_REGEX = /tts/i;
var ASL_REGEX = /asl/i;
var DECK_REGEX = /(?:[^:]+::)*([^:]+)/;

var LANG_NAMES_TO_CODES = {
  "Arabic":   "AR",
  "English":  "EN",
  "Español":  "ES",
  "Français": "FR",
  "Japanese": "JA",
  "Korean":   "KO",
  "Magyar":   "HU",
  "Русский":  "RU",
};

var SPECIAL_CASE_COUNTRY_CODES = {
  "EN": "US",
  "ES": "MX",
  "JA": "JP",
  "KO": "KR",
  "ZH": "CN",
};

function setup() {
  setupDeckName();
  setupClasses();
  setupTTS();
  appendDebug("Deck: " + DECK);
  appendDebug("Card: " + CARD);
}

function setupDeckName() {
  var deck = document.getElementById("deck");
  if (!deck) return;

  var match = deck.textContent.match(DECK_REGEX);
  if (!match) return;

  deck.innerHTML = match[1];
}

function setupClasses() {
  removeCustomClasses();

  var deckElem = document.getElementById("deck");
  var deck = (deckElem ? deckElem.textContent : DECK);

  var newClasses = "";
  newClasses += transmogrify(deck);
  newClasses += transmogrify(NOTE);
  newClasses += transmogrify(CARD);
  newClasses += transmogrify(TAGS);

  // document.body.className gets overwritten by Anki Javascript that runs
  // later, so set the <html> documentElement instead.
  document.documentElement.className += " " + newClasses;

  if (NOTE === "Cloze") {
    if (deck.indexOf("Español") !== -1) {
      document.body.className = document.body.className + " es-only";
    }
    if (deck.indexOf("Français") !== -1) {
      document.body.className = document.body.className + " fr-only";
    }
    if (deck.indexOf("Deutsch") !== -1) {
      document.body.className = document.body.className + " de-only";
    }
  }
}

function transmogrify(type) {
  var newClasses = "";

  if (TTS_REGEX.test(type)) newClasses += "tts ";
  if (ASL_REGEX.test(type)) newClasses += "asl ";

  newClasses += type.replace(" → ", "-").replace(" ⇔ ", "-").replace(" ", "-").replace(/::/g, "-").toLowerCase() + " ";
  newClasses = newClasses.replace("-tts", "-only");
  return newClasses;
}

function setupTTS() {
  var tts = document.getElementById("tts");
  if (!tts) return
  if (typeof SpeechSynthesisUtterance === "undefined") {
    tts.style.backgroundImage = "none";
    return;
  }

  tts.addEventListener("click", speak, false);

  // If we're on the question-side of a TTS card, auto-play the word.
  // If we're on the answer-side of a TTS card, un-hide the answer.
  if (TTS_REGEX.test(CARD)) {
    if (document.getElementById("answer") == null) {
      window.setTimeout(speak, 500); 
    } else {
      tts.classList.remove("hidden");
    }
  }
}

function removeCustomClasses() {
  var existingClasses = document.documentElement.className;

  // Delete any previous classes; stock Anki doesn't use any with "-", so its
  // presence means we were the ones who modified it.
  var hyphenIndex = existingClasses.indexOf("-");

  if (hyphenIndex > -1) {
    // Eg: "chrome mac js vocab-words-adverbs" => "chrome mac js vocab"
    existingClasses = existingClasses.substring(0, hyphenIndex);

    // Eg: "chrome mac js vocab" => "chrome mac js"
    var spaceIndex = existingClasses.lastIndexOf(" ");
    existingClasses = existingClasses.substring(0, spaceIndex);

    document.documentElement.className = existingClasses;
  }
}

function speak(e) {
  if (e) e.preventDefault();

  // remove any IPA inside slashes or notes inside parentheses
  var tts = document.getElementById("tts");
  var text = tts.textContent.replace(/\/.*?\//g, '');
  text = text.replace(/\(.*?\)/g, '');
  doSpeak(text);  
}

function doSpeak(text) { 
  var speech = new SpeechSynthesisUtterance(); 
  speech.text = text; 
  speech.volume = 0.5; // 0 to 1 
  speech.rate = 0.9; // 0.1 to 9
  speech.pitch = 1; // 0 to 2, 1=normal 
  speech.lang = getLangCodeForTTS();
  speechSynthesis.cancel(); 
  speechSynthesis.speak(speech); 
}

function getLangCodeForTTS() {
  var deckLangNameMatch = DECK.match(/Language::(\w+)/);
  var ttsLangCodeMatch = CARD.match(/(\w+) TTS/);
  var transLangCodeMatch = CARD.match(/(\w+) → (\w+)/);
  var langCode = "EN";

  if (deckLangNameMatch) {
    langCode = LANG_NAMES_TO_CODES[deckLangNameMatch[1]];
  } else if (ttsLangCodeMatch) {
    langCode = ttsLangCodeMatch[1];
  } else if (transLangCodeMatch) {
    langCode = transLangCodeMatch[2];
    if (langCode == "EN") {
     langCode = transLangCodeMatch[1];
    }
  }

  var countryCode = SPECIAL_CASE_COUNTRY_CODES[langCode];
  if (!countryCode) countryCode = langCode;

  return langCode.toLowerCase() + '-' + countryCode;
}

function appendDebug(msg) {
  if (!DEBUG) return;
  if (!msg) msg = '<undefined>';

  var debug = document.getElementById("debug");
  if (debug) {
    debug.innerHTML += htmlEscape(msg) + "<br/>";
  }
}

function htmlEscape(str) {
  if (!str) return '<null>';

  // Quick & dirty.
  // http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
  return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
}

//document.addEventListener('DOMContentLoaded', setup); // doesn't work on phone
setup();
