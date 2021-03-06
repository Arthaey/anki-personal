/* global Speaker EnglishLanguage FrenchLanguage appendDebug */

function Card(params) {
  this.dom = this.requiredParam(params.dom, "dom");
  this.deckName = this.requiredParam(params.deck, "deckName");
  this.noteType = this.requiredParam(params.note, "noteType");
  this.cardType = this.requiredParam(params.card, "cardType");
  this.tags = params.tags;
  this.recognitionClozeProductionId = params.recognitionClozeProductionId;
  this.recognitionClozeRecognitionId = params.recognitionClozeRecognitionId;

  this.front = this.dom.querySelector(".card.front");
  this.back = this.dom.querySelector(".card.back");

  // document.body.className gets overwritten by Anki Javascript that runs
  // later, so set the <html> documentElement instead.
  this.root = document && document.documentElement ? document.documentElement : this.dom;

  var classes = [].slice.apply(this.getClassList());
  this.originalAnkiClasses = classes.filter(function(className) {
    return Card.ankiClassesWhitelist.includes(className);
  });

  this.speaker = new Speaker();

  var setupFunctions = [
    this.setupLayout,
    this.setupDeckName,
    this.setupClasses,
    this.setupDeckNameWidth,
    this.setupSlashHeight,
    this.setupVerbs,
    this.setupTTS,
    this.setupCitations,
    this.modifyContent,
    this.addExtraUi,
    this.showCard
  ];

  var setupResult = "";

  for (var i = 0; i < setupFunctions.length; i++) {
    try {
      var result = setupFunctions[i].call(this);
      setupResult += " " + result;
    } catch (error) {
      throw "Failed to set up card; " +
        "completed " + i + " out of " + setupFunctions.length + " steps.\n\n" +
        "Partial results:\n\n" + setupResult + "\n\nERROR: " + error;
    }
  }

  appendDebug("Card created." + setupResult);
}

Card.prototype.requiredParam = function(value, name) {
  if (!value) {
    throw "Card parameter '" + name + "' is required.";
  }
  return value;
};

Card.prototype.setupLayout = function() {
  if (!this.front) return "Card does not have a front side.";

  var debug = this.dom.querySelector("#debug");
  if (!debug) {
    debug = this.front.ownerDocument.createElement("div");
    debug.id = "debug";
    debug.className = "extra";
    this.front.parentNode.appendChild(debug);
  }

  var cardInfo = this.dom.querySelector(".card-info");
  if (!cardInfo) {
    var tagsHtml = "";
    var fullTags = (this.tags ? this.tags.split(/\s+/) : []);
    for (var i = 0; i < fullTags.length; i++) {
      var fullTag = fullTags[i];
      if (/^source::shared::/i.test(fullTag)) continue;
      tagsHtml += '<span class="tag">' + this.leafify(fullTags[i]) + "</span>";
    }

    var displayCardType = this.isRecognitionClozeCard() ? "Cloze Recognition" : this.cardType;

    cardInfo = this.front.ownerDocument.createElement("div");
    cardInfo.className = "card-info";
    cardInfo.innerHTML =
       '<div class="tags">' + tagsHtml + "</div>" +
       '<div class="slash"></div>' +
       '<div class="deck">' +
       //'  <span id="deck">' + this.deckName + "</span>:" +
       '  <span class="card-type">' + displayCardType + "</span>" +
       "</div>"
    ;
    this.front.parentNode.insertBefore(cardInfo, this.front);
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

  if (this.noteType.startsWith("Cloze")) {
    if (this.deckName.includes("Deutsch")) {
      newClasses += " de-only ";
    }
    if (this.deckName.includes("Español")) {
      newClasses += " es-only ";
    }
    if (this.deckName.includes("Français")) {
      newClasses += " fr-only ";
    }

    if (this.tags.includes("dialog")) {
      newClasses += " tts ";
    }
  }

  var tags = this.tags.split(/\s+/);
  var types = [ this.deckName, this.noteType, this.cardType ].concat(tags);
  for (var i = 0; i < types.length; i++ ) {
    var type = types[i];
    if (!type) continue;

    if (/tts/i.test(type)) newClasses += " tts ";
    if (/asl/i.test(type)) newClasses += " asl ";

    var typeClass = type;
    typeClass = typeClass.replace(/[[\]()]/g, "");
    typeClass = typeClass.replace(/ [→⇔-] /g, "-");
    typeClass = typeClass.replace(/:+\s*/g,  "-");
    typeClass = typeClass.replace(/\s+/g, "-");
    newClasses += " " + typeClass + " ";
  }

  newClasses += " " + this.getLanguageCode() + " ";
  newClasses = newClasses.replace("-tts", "-only");

  if (newClasses.match(/\b(DE|Deutsch)\b/i)) {
    var frontFirstWord = this.front.textContent.split(/\s+/)[0];
    var backFirstWord = this.back ? this.back.textContent.split(/\s+/)[0] : "";

    if (frontFirstWord === "der" || backFirstWord === "der") {
      newClasses += " noun-masc";
    } else if (frontFirstWord === "die" || backFirstWord === "die") {
      newClasses += " noun-fem";
    } else if (frontFirstWord === "das" || backFirstWord === "das") {
      newClasses += " noun-neut";
    }
  }

  var LONG_TEXT_CUTOFF = 40;
  var frontLength = this.getTextLength(this.front);
  var backLength = this.getTextLength(this.back);
  if (frontLength > LONG_TEXT_CUTOFF || backLength > LONG_TEXT_CUTOFF) {
    newClasses += " style-small-text";
  }

  this.setClasses(newClasses.toLowerCase());

  return "Classes = '" + newClasses.toLowerCase() + "'.";
};

Card.prototype.setupSlashHeight = function() {
  var cardInfo = this.dom.querySelector(".card-info");
  var slash = this.dom.querySelector(".slash");
  if (!cardInfo || !slash) return;

  var cardInfoStyles = getComputedStyle(cardInfo);
  slash.style.borderBottomWidth = cardInfoStyles.getPropertyValue("height");
  return "Set slash height.";
};

Card.prototype.setupDeckNameWidth = function() {
  var cardInfo = this.dom.querySelector(".card-info");
  var deck = this.dom.querySelector(".deck");
  var tags = this.dom.querySelector(".tags");
  if (!cardInfo || !deck || !tags) return;

  var cardWidth     = this.getWidth(cardInfo.parentNode);
  var cardInfoWidth = this.getWidth(cardInfo);
  var deckWidth     = this.getWidth(deck);

  if (cardInfoWidth > cardWidth) {
    deck.style.whiteSpace = "normal";
    deck.style.width = "100%";
    tags.style.width = "unset";
    cardInfoWidth = this.getWidth(cardInfo);
    deckWidth     = this.getWidth(deck);
  }

  tags.style.width = (cardInfoWidth - deckWidth) + "px";
  return "Set tags width.";
};

Card.prototype.getWidth = function(element) {
  var styles = getComputedStyle(element);
  var width = styles.getPropertyValue("width");
  return width.match(/^([-+]?[0-9]+(\.[0-9]+)?)/)[0];
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
    var resultMsg = "Verbs set up: ";

    var enVerb = this.dom.querySelector("#en-infinitive");
    if (enVerb) {
      enVerb.textContent = EnglishLanguage.conjugate(enVerb.textContent, person, tense);
      resultMsg += "EN '" + enVerb.textContent + "'. ";
    }

    var frVerb = this.dom.querySelector("#fr-infinitive");
    if (frVerb) {
      frVerb.textContent = FrenchLanguage.conjugate(frVerb.textContent, person, tense);
      resultMsg += "FR '" + frVerb.textContent + "'. ";
    }

    this.addClass("fr");
    return resultMsg;
  } else {
    return "Not a French verb.";
  }
};

Card.prototype.setupCitations = function() {
  var citation = this.dom.querySelector("cite");
  if (!citation) return "Card does not have any citations.";

  var urlRegex = /^https?:\/\/(([^/]+)(\/[^/#]+)+.*$)/;
  var match = citation.textContent.match(urlRegex);
  if (match) {
    var LONG_URL_CUTOFF = 20;
    var urlWithoutProtocol = match[1];
    var truncatedUrl = match[2];
    var shortUrl = (match[1].length <= LONG_URL_CUTOFF) ? urlWithoutProtocol : truncatedUrl;
    citation.innerHTML = shortUrl;
  }

  if (this.tags) {
    var sourceTag;

    var tags = this.tags.split(/\s+/);
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].startsWith("source::")) {
        sourceTag = tags[i];
      }
    }

    if (sourceTag) {
      sourceTag = this.leafify(sourceTag);
      sourceTag = sourceTag[0].toUpperCase() + sourceTag.substring(1);
      citation.innerHTML = sourceTag + ", " + citation.innerHTML;
    }
  }

  return "Citation source = " + citation.innerHTML;
};

Card.prototype.modifyContent = function() {
  if (this.isRecognitionClozeCard()) {
    this.front.querySelectorAll(".cloze").forEach(function(cloze) {
      cloze.innerHTML = cloze.innerHTML.replace(/^\[(.+)\]$/, "$1");
    });
  }
};

Card.prototype.addExtraUi = function() {
  if (this.getClassList().contains("personal-phone") && this.isQuestionSide()) {
    var numpad = this.front.ownerDocument.createElement("div");
    numpad.className = "numpad";
    numpad.innerHTML =
      "<div> <button>1</button> <button>2</button> <button>3</button> </div>" +
      "<div> <button>4</button> <button>5</button> <button>6</button> </div>" +
      "<div> <button>7</button> <button>8</button> <button>9</button> </div>" +
      "<div> <button>*</button> <button>0</button> <button>#</button> </div>"
    ;
    this.front.parentNode.appendChild(numpad);
    return "Added numpad.";
  }

  return "Did NOT add numpad.";
};

Card.prototype.showCard = function() {
  this.addClass("show");
  return "Display card.";
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
  return this.getClassList().contains("tts");
};

Card.prototype.isRecognitionClozeCard = function() {
  return this.noteType === "Cloze (and recognition card)" &&
    this.recognitionClozeProductionId &&
    this.recognitionClozeRecognitionId === "";
};

Card.prototype.getClassList = function() {
  return this.root.classList;
};

Card.prototype.hasClasses = function() {
  return this.getClassList().length != 0;
};

Card.prototype.setClasses = function(newClasses) {
  this.root.className = this.originalAnkiClasses.join(" ") + " " + newClasses;
};

Card.prototype.addClass = function(newClass) {
  this.root.className = this.root.className + " " + newClass;
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
    "Русский":  "RU"
  };

  var langCode = "EN";

  var deckLangNameMatch = this.deckName.match(/Language::([^\s:]+)/);
  var ttsLangCodeMatch = this.cardType.match(/(\S+) TTS/);
  var transLangCodeMatch = this.cardType.match(/(\S+) → (\S+)/);

  if (this.noteType === "Verbs: French") {
    langCode = langNamesToCodes["Français"];
  } else if (deckLangNameMatch) {
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

Card.prototype.getTextLength = function(el) {
  if (!el) return 0;

  var cloneEl = el.cloneNode(true);
  cloneEl.querySelectorAll(".extra").forEach(function(extra) {
    extra.parentNode.removeChild(extra);
  });

  return cloneEl.textContent.length;
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
      //this.dom.querySelector("#deck") &&
      this.dom.querySelector(".card-type") &&
      this.dom.querySelector(".slash") &&
      this.dom.querySelector(".card.front") &&
      this.dom.querySelector("#debug")
  );
};

Card.ttsAutoPlayDelay = 500; // milliseconds

// https://rafael.adm.br/css_browser_selector/
Card.ankiClassesWhitelist = [
  "win",
  "vista",
  "linux",
  "mac",
  "freebsd",
  "ipod",
  "ipad",
  "iphone",
  "webtv",
  "j2me",
  "blackberry",
  "android",
  "mobile",
  "ie",
  "ie8",
  "ie7",
  "ie6",
  "ie5",
  "gecko",
  "ff3_6",
  "ff3_5",
  "ff3",
  "ff2",
  "opera",
  "opera10",
  "opera9",
  "opera8",
  "konqueror",
  "webkit",
  "safari",
  "safari3",
  "chrome",
  "iron",
  "js"
];
