function Card(dom, deckName, noteType, cardType, tags) {
  this.dom = this.requiredParam(dom, "dom");
  this.deckName = this.requiredParam(deckName, "deckName");
  this.noteType = this.requiredParam(noteType, "noteType");
  this.cardType = this.requiredParam(cardType, "cardType");
  this.tags = tags;

  // document.body.className gets overwritten by Anki Javascript that runs
  // later, so set the <html> documentElement instead.
  this.root = document && document.documentElement ? document.documentElement : dom;

  this.speaker = new Speaker();
}

Card.prototype.requiredParam = function(value, name) {
  if (!value) {
    console.error("Card paramater '" + name + "' is required.");
  }
  return value;
};

Card.prototype.setupDeckName = function() {
  if (!this.hasExpectedLayout()) return;
  var deck = this.dom.querySelector("#deck");
  var deckRegex = /(?:[^:]+::)*([^:]+)/;
  var match = this.deckName.match(deckRegex);
  deck.innerHTML = match[1];
};

Card.prototype.setupClasses = function() {
  this.removeCustomClasses();

  var newClasses = "";

  var types = [this.deckName, this.noteType, this.cardType, this.tags];
  for (var i = 0; i < types.length; i++ ) {
    var type = types[i];
    if (!type) continue;

    if (/tts/i.test(type)) newClasses += " tts ";
    if (/asl/i.test(type)) newClasses += " asl ";

    if (this.noteType === "Cloze") {
      if (this.deckName.includes("Español"))  newClasses += " es-only ";
      if (this.deckName.includes("Français")) newClasses += " fr-only ";
      if (this.deckName.includes("Deutsch"))  newClasses += " de-only ";
    }

    var typeClass = type;
    typeClass = typeClass.replace(" → ", "-");
    typeClass = typeClass.replace(" ⇔ ", "-");
    typeClass = typeClass.replace(" ", "-");
    typeClass = typeClass.replace(/::/g, "-");
    newClasses += " " + typeClass + " ";
  }

  newClasses = newClasses.replace("-tts", "-only");

  this.setClasses(newClasses.toLowerCase());
};

Card.prototype.setupTTS = function() {
  var tts = this.dom.querySelector("#tts");

  if (!tts) return;
  if (!this.speaker.canSpeak()) {
    tts.id = null;
    return;
  }

  var speakFn = this.speakFn(tts.textContent).bind(this);
  tts.addEventListener("click", speakFn, false);

  if (this.isQuestionSide()) {
    tts.classList.add("hidden");
    setTimeout(speakFn, Card.ttsAutoPlayDelay);
  } else {
    tts.classList.remove("hidden");
  }
};

Card.prototype.setupVerbs = function() {
  if (this.noteType === "Verbs: French") {
    var verbInfoRegex = /(\d[a-z]+)([A-Z]\S*)/;
    var verbInfo = this.cardType.match(verbInfoRegex);
    if (!verbInfo) return;

    var person = verbInfo[1];
    var tense = verbInfo[2];

    var enVerb = this.dom.querySelector("#en-infinitive");
    enVerb.innerText = EnglishLanguage.conjugate(enVerb.textContent, person, tense);

    var frVerb = this.dom.querySelector("#fr-infinitive");
    frVerb.innerText = FrenchLanguage.conjugate(frVerb.textContent, person, tense);
  }
};

Card.prototype.speakFn = function(text) {
  return function() {
    this.speaker.speak(text, this.getLanguageCode());
  };
};

Card.prototype.isQuestionSide = function() {
  return !this.dom.querySelector("#answer");
};

Card.prototype.getClassList = function() {
  return this.root.classList;
};

Card.prototype.hasClasses = function() {
  return this.getClassList().length != 0;
};

Card.ankiClasses = [
  "webkit",
  "safari",
  "mac",
  "js"
];

Card.prototype.setClasses = function(newClasses) {
  this.root.className = Card.ankiClasses + " " + newClasses;
};

Card.prototype.removeCustomClasses = function() {
  var classNames = this.root.className.split(/\s+/);
  for (var className of classNames) {
    if (this.hasClasses() && !Card.ankiClasses.includes(className)) {
      this.root.classList.remove(className);
    }
  };
};

Card.prototype.getLanguageCode = function() {
  var langNamesToCodes = {
    "Arabic":   "AR",
    "English":  "EN",
    "Español":  "ES",
    "Français": "FR",
    "Japanese": "JA",
    "Korean":   "KO",
    "Magyar":   "HU",
    "Русский":  "RU",
  };

  var langCode = "EN";

  var deckLangNameMatch = this.deckName.match(/Language::([^\s:]+)/);
  var ttsLangCodeMatch = this.cardType.match(/(\S+) TTS/);
  var transLangCodeMatch = this.cardType.match(/(\S+) → (\S+)/);

  if (deckLangNameMatch) {
    langCode = langNamesToCodes[deckLangNameMatch[1]];
  } else if (ttsLangCodeMatch) {
    langCode = ttsLangCodeMatch[1];
  } else if (transLangCodeMatch) {
    langCode = transLangCodeMatch[2];
    if (langCode == "EN") {
     langCode = transLangCodeMatch[1];
    }
  }

  return langCode;
};

Card.prototype.hasExpectedLayout = function() {
  return !!(
      this.dom &&
      this.dom.querySelector(".card-info") &&
      this.dom.querySelector(".tags") &&
      this.dom.querySelector(".deck") &&
      this.dom.querySelector("#deck") &&
      this.dom.querySelector(".card-type") &&
      this.dom.querySelector(".slash") &&
      this.dom.querySelector(".card.front") &&
      this.dom.querySelector("#debug")
    );
};

Card.ttsAutoPlayDelay = 500; // milliseconds
