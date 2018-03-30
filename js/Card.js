function Card(dom, deckName, noteType, cardType, tags) {
  this.dom = this.requiredParam(dom, "dom");
  this.deckName = this.requiredParam(deckName, "deckName");
  this.noteType = this.requiredParam(noteType, "noteType");
  this.cardType = this.requiredParam(cardType, "cardType");
  this.tags = tags;

  // document.body.className gets overwritten by Anki Javascript that runs
  // later, so set the <html> documentElement instead.
  this.root = document && document.documentElement ? document.documentElement : dom;
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
  var match = this.deckName.match(DECK_REGEX);
  deck.innerHTML = match[1];
};

Card.prototype.setupClasses = function() {
  this.removeCustomClasses();

  var newClasses = "";

  var types = [this.deckName, this.noteType, this.cardType, this.tags];
  for (var i = 0; i < types.length; i++ ) {
    var type = types[i];
    if (!type) continue;

    if (TTS_REGEX.test(type)) newClasses += " tts ";
    if (ASL_REGEX.test(type)) newClasses += " asl ";

    if (this.noteType === "Cloze") {
      if (this.deckName.includes("Español"))  newClasses += " es-only ";
      if (this.deckName.includes("Français")) newClasses += " fr-only ";
      if (this.deckName.includes("Deutsch"))  newClasses += " de-only ";
    }

    newClasses += " ";
    newClasses += type.replace(" → ", "-").replace(" ⇔ ", "-").replace(" ", "-").replace(/::/g, "-");
    newClasses += " ";
  }

  newClasses = newClasses.replace("-tts", "-only");

  this.setClasses(newClasses.toLowerCase());
};

Card.prototype.getClassList = function() {
  return this.root.classList;
}

Card.prototype.hasClasses = function() {
  return this.getClassList().length != 0;
}

Card.prototype.setClasses = function(newClasses) {
  this.root.className = ANKI_CLASSES + " " + newClasses;
}

Card.prototype.removeCustomClasses = function() {
  var classNames = this.root.className.split(/\s+/);
  for (var className of classNames) {
    if (this.hasClasses() && !ANKI_CLASSES.includes(className)) {
      this.root.classList.remove(className);
    }
  };
}

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
}
