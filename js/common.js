var DEBUG = (typeof DEBUG === 'undefined') ? false : DEBUG;

var FRENCH_VERB_NOTE_NAME = "Verbs: French";

var VERB_INFO_REGEX = /(\d[a-z]+)([A-Z]\S*)/;

var FR_CONJUGATIONS = {
  "Pres": {
    "er": {
      "1sg": "e",    "1pl": "ons",
      "2sg": "es",   "2pl": "ez",
      "3sg": "e",    "3pl": "ent"
    },
    "ir": {
      "1sg": "is",   "1pl": "issons",
      "2sg": "is",   "2pl": "issez",
      "3sg": "it",   "3pl": "issent"
    },
    "re": {
      "1sg": "s",    "1pl": "ons",
      "2sg": "s",    "2pl": "ez",
      "3sg": "",     "3pl": "ent"
    }
  }
};


function setup(dom, deckName, noteType, cardType, tags) {
  var card = new Card(dom, deckName, noteType, cardType, tags);
  card.setupDeckName();
  card.setupClasses();
  card.setupTTS();

  setupVerbs(noteType, cardType);
}

function setupVerbs(noteType, cardType) {
  var verbInfo = cardType.match(VERB_INFO_REGEX);
  if (!verbInfo) return;

  var person = verbInfo[1];
  var tense = verbInfo[2];

  if (noteType == FRENCH_VERB_NOTE_NAME) {
    setupEnglishVerb(person, tense);
    setupFrenchVerb(person, tense);
  }
}

function setupEnglishVerb(person, tense) {
  var infinitive = document.getElementById("en-infinitive");
  if (!infinitive) return;

  var verbStem = infinitive.innerText.replace(/^to /, "");
  var suffix = (person === "3sg") ? "s" : "";
  var conjugated = verbStem + suffix;
  infinitive.innerText = conjugated;
}

function setupFrenchVerb(person, tense) {
  var infinitive = document.getElementById("fr-infinitive");

  if (!infinitive) return;

  var verbStem = infinitive.innerText.substr(0, infinitive.innerText.length - 2);
  var verbEnding = infinitive.innerText.substr(-2, 2);
  var suffix = FR_CONJUGATIONS[tense][verbEnding][person];
  var conjugated = verbStem + suffix;
  infinitive.innerText = conjugated;
  // TODO: "je" => "j'"
}

function appendDebug(msg) {
  if (!DEBUG) return;
  if (!msg) msg = '<undefined>';

  var debug = document.getElementById("debug");
  if (debug) {
    debug.innerHTML += htmlEscape(msg) + "<br/>";
  }
}

function appendDebugSourceCode() {
  if (!DEBUG) return;

  var element = document.querySelector(".card.front");
  var code = document.createElement("div");
  code.className = "code";

  var debug = document.getElementById("debug");
  if (debug) {
    debug.innerHTML += new XMLSerializer().serializeToString(element);
    debug.innerHTML += "<br/>";
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
//setup();

