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

  var setupFunctions = [
    this.setupLayout,
    this.setupDeckName,
    this.setupClasses,
    this.setupSlashHeight,
    this.setupTTS,
    this.setupVerbs
  ];

  var setupResult = "";
  for (var i = 0; i < setupFunctions.length; i++) {
    var result = setupFunctions[i].call(this);
    setupResult += " " + result;
  }

  appendDebug("Card created." + setupResult);
}

Card.prototype.requiredParam = function(value, name) {
  if (!value) {
    console.error("Card paramater '" + name + "' is required.");
  }
  return value;
};

Card.prototype.setupLayout = function() {
  var front = this.dom.querySelector(".card.front");
  if (!front) return "Card does not have a front side.";

  var cardInfo = this.dom.querySelector(".card-info");
  if (!cardInfo) {
    var tagsHtml = '';
    var fullTags = (this.tags ? this.tags.split(/\s+/) : []);
    for (var i = 0; i < fullTags.length; i++) {
      tagsHtml += '<span class="tag">' + this.leafify(fullTags[i]) + '</span>';
    };

    cardInfo = front.ownerDocument.createElement("div");
    cardInfo.className = "card-info";
    cardInfo.innerHTML =
        '<div class="tags">' + tagsHtml + '</div>' +
        '<div class="slash"></div>' +
        '<div class="deck">' +
        '  <span id="deck">' + this.deckName + '</span>:' +
        '  <span class="card-type">' + this.cardType + '</span>' +
        '</div>'
    ;
    front.parentNode.insertBefore(cardInfo, front);
  }

  var debug = this.dom.querySelector("#debug");
  if (!debug) {
    debug = front.ownerDocument.createElement("div");
    debug.id = "debug";
    debug.className = "extra";
    front.parentNode.appendChild(debug);
  }

  if (!this.hasExpectedLayout()) return "Card layout does not seem correct.";

  return "Added card info header to the layout.";
};

Card.prototype.setupDeckName = function() {
  var deck = this.dom.querySelector("#deck");
  if (!deck) return "Card does not have a deck name.";

  deck.innerHTML = this.leafify(this.deckName);
  return "Deck name = '" + deck.innerHTML + "'.";
};

Card.prototype.setupClasses = function() {
  this.resetClasses();
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

  newClasses += " " + this.getLanguageCode() + " ";
  newClasses = newClasses.replace("-tts", "-only");

  this.setClasses(newClasses.toLowerCase());

  return "Classes = '" + newClasses.toLowerCase() + "'.";
};

Card.prototype.setupSlashHeight = function() {
  var cardInfo = this.dom.querySelector(".card-info");
  if (!cardInfo) return;

  var cardInfoStyles = getComputedStyle(cardInfo);
  var slash = this.dom.querySelector(".slash");
  slash.style.borderBottomWidth = cardInfoStyles.getPropertyValue("height");
  return "Set slash height.";
};


Card.prototype.setupTTS = function() {
  var tts = this.dom.querySelector("#tts");

  if (!tts) return "#tts element does not exist.";
  if (!this.speaker.canSpeak()) {
    tts.id = null;
    return "TTS is not available.";
  }

  var ttsTrigger = this.dom.querySelector(".tts-trigger");
  if (ttsTrigger) ttsTrigger.remove();

  ttsTrigger = tts.ownerDocument.createElement("a");
  ttsTrigger.classList.add("tts-trigger");
  this.dom.appendChild(ttsTrigger);

  var speakFn = this.speakFn(tts.textContent).bind(this);
  ttsTrigger.addEventListener("click", speakFn, false);

  if (this.isQuestionSide() && this.isTTSCardType()) {
    tts.classList.add("hidden");
    setTimeout(speakFn, Card.ttsAutoPlayDelay);
    return "TTS set up with autoplay.";
  } else {
    tts.classList.remove("hidden");
    return "TTS set up without autoplay.";
  }
};

Card.prototype.setupVerbs = function() {
  if (this.noteType === "Verbs: French") {
    var verbInfoRegex = /(\d[a-z]+)([A-Z]\S*)/;
    var verbInfo = this.cardType.match(verbInfoRegex);
    if (!verbInfo) return "Could not parse verb info from " + this.cardType + ".";

    var person = verbInfo[1];
    var tense = verbInfo[2];

    var enVerb = this.dom.querySelector("#en-infinitive");
    enVerb.innerText = EnglishLanguage.conjugate(enVerb.textContent, person, tense);

    var frVerb = this.dom.querySelector("#fr-infinitive");
    frVerb.innerText = FrenchLanguage.conjugate(frVerb.textContent, person, tense);

    return "Verbs set up: EN '" + enVerb.innerText + "', FR '" + frVerb.innerText + "'.";
  } else {
    return "Not a French verb.";
  }
};

Card.prototype.speakFn = function(text) {
  appendDebug("speakFn called.");
  return function() {
    this.speaker.speak(text, this.getLanguageCode());
  };
};

Card.prototype.isQuestionSide = function() {
  return !this.dom.querySelector("#answer");
};

Card.prototype.isTTSCardType = function() {
  return /tts/i.test(this.cardType);
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
  this.root.className = Card.ankiClasses.join(" ") + " " + newClasses;
};

Card.prototype.resetClasses = function() {
  this.setClasses("");
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

Card.prototype.leafify = function(fullyQualifiedName) {
  var regex = /(?:[^:]+::)*([^:]+)/;
  var match = fullyQualifiedName.match(regex);
  return match ? match[1] : fullyQualifiedName;
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
