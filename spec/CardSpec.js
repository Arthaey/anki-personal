describe("Card", function() {
  var card;

  function createCard(deckName, noteType, cardType) {
    if (!deckName) deckName = "MyDeckName";
    if (!noteType) noteType = "MyNoteType";
    if (!cardType) cardType = "MyCardType";
    return new Card(createCardFront(), deckName, noteType, cardType);
  }

  beforeEach(function() {
    card = createCard();
  });

  afterEach(function() {
      document.documentElement.className = "";
  });

  it("constructor", function() {
    card = new Card(createCardFront(), "MyDeckName", "MyNoteType", "MyCardType", "MyTags");
    expect(card.deckName).toBe("MyDeckName");
    expect(card.noteType).toBe("MyNoteType");
    expect(card.cardType).toBe("MyCardType");
    expect(card.tags).toBe("MyTags");
  });

  it("knows when it's on the question side", function() {
    card = new Card(createCardFront(), "MyDeckName", "MyNoteType", "MyCardType");
    expect(card.isQuestionSide()).toBe(true);
  });

  it("knows when it's on the answer side", function() {
    card = new Card(createCardFrontAndBack(), "MyDeckName", "MyNoteType", "MyCardType");
    expect(card.isQuestionSide()).toBe(false);
  });

  describe("check for expected HTML", function() {
    it("finds layout", function() {
      expect(card.hasExpectedLayout()).toBe(true);
    });

    it("missing layout", function() {
      var element = dom.createElement("container");
      var missingCard = new Card(element, "MyDeckName", "MyNoteType", "MyCardType");
      expect(missingCard.hasExpectedLayout()).toBe(false);
    });
  });

  describe("sets deck name", function() {
    it("to given name", function() {
      var htmlBefore = card.dom.outerHTML;
      expect(card.dom.querySelector("#deck")).toHaveText("MyDeckName");
    });

    it("using only last portion of nested deck name", function() {
      card = createCard("Foo::Bar::MyDeckName");
      var deck = card.dom.querySelector("#deck");
      expect(deck).toHaveText("MyDeckName");
      expect(deck).not.toHaveText("Foo");
      expect(deck).not.toHaveText("Bar");
    });

    it("ignores missing element", function() {
      var missingDeck = createCardFront();
      missingDeck.querySelector("#deck").remove();

      expect(function() {
        new Card(missingDeck, "MyDeckName", "MyNoteType", "MyCardType");
      }).not.toThrow();
    });
  });

  describe("sets CSS classes", function() {
    it("removes existing custom classes", function() {
      document.documentElement.className = "foo bar";

      card = createCard();
      card.setupClasses();

      expect(card.getClassList()).not.toContain("foo");
      expect(card.getClassList()).not.toContain("bar");
    });

    it("adds 'tts' for TTS cards", function() {
      card = createCard("deck-tts");
      card.setupClasses();
      expect(card.getClassList()).toContain("tts");
    });

    it("adds 'asl' for ASL cards", function() {
      card = createCard("deck-asl");
      card.setupClasses();
      expect(card.getClassList()).toContain("asl");
    });

    it("adds 'es-only' for monolingual Spanish clozes", function() {
      card = createCard("Foo::Español::Bar", "Cloze");
      card.setupClasses();
      expect(card.getClassList()).toContain("es-only");
    });

    it("adds 'fr-only' for monolingual French clozes", function() {
      card = createCard("Foo::Français::Bar", "Cloze");
      card.setupClasses();
      expect(card.getClassList()).toContain("fr-only");
    });

    it("adds 'de-only' for monolingual German clozes", function() {
      card = createCard("Foo::Deutsch::Bar", "Cloze");
      card.setupClasses();
      expect(card.getClassList()).toContain("de-only");
    });

    it("does NOT add '*-only' for non-clozes", function() {
      card = createCard("Foo::Español::Bar", "not-Cloze");
      card.setupClasses();
      expect(card.getClassList()).not.toContain("es-only");
    });

    it("adds non-English language for translation pair X → EN", function() {
      card = createCard("Foo", "not-Cloze", "ES → EN");
      card.setupClasses();
      expect(card.getClassList()).toContain("es");
    });

    it("adds non-English language for translation pair EN → X", function() {
      card = createCard("Foo", "not-Cloze", "EN → ES");
      card.setupClasses();
      expect(card.getClassList()).toContain("es");
    });

    it("adds each of deck/note/card/tag to classes too", function() {
      card = new Card(createCardFront(), "MyDeckName", "MyNoteType", "MyCardType", "MyTags");
      card.setupClasses();
      expect(card.getClassList()).toContain("mydeckname");
      expect(card.getClassList()).toContain("mynotetype");
      expect(card.getClassList()).toContain("mycardtype");
      expect(card.getClassList()).toContain("mytags");
    });

    it("makes lowercase", function() {
      card = createCard("LOWERCASE");
      card.setupClasses();
      expect(card.getClassList()).not.toContain("LOWERCASE");
      expect(card.getClassList()).toContain("lowercase");
    });

    it("replaces arrows with dashes", function() {
      card = createCard("a → b", "c ⇔ d");
      card.setupClasses();
      expect(card.getClassList()).toContain("a-b");
      expect(card.getClassList()).toContain("c-d");
    });

    it("replaces spaces with dashes", function() {
      card = createCard("a b");
      card.setupClasses();
      expect(card.getClassList()).toContain("a-b");
    });

    it("replaces subdeck-separators with dashes", function() {
      card = createCard("a::b");
      card.setupClasses();
      expect(card.getClassList()).toContain("a-b");
    });

    it("replaces '-tts' with '-only'", function() {
      card = createCard("es-tts");
      card.setupClasses();
      expect(card.getClassList()).toContain("es-only");
    });

    it("ignores missing tags", function() {
      card = new Card(createCardFront(), "MyDeckName", "MyNoteType", "MyCardType");
      expect(function() {
        card.setupClasses()
      }).not.toThrow();
    });

  });

  describe("TTS", function() {
    var dom;

    beforeEach(function() {
      jasmine.clock().install();

      dom = createCardFront();
      var cardFront = dom.querySelector(".card.front");
      cardFront.id = "tts";
      cardFront.innerText = "front text";
      card = new Card(dom, "MyDeckName", "MyNoteType", "MyCardType");
      spyOn(card.speaker, "speak");
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("plays when clicked", function() {
      card.dom.querySelector(".tts-trigger").click();
      expect(card.speaker.speak).toHaveBeenCalledWith("front text", "EN")
    });

    it("hides word & auto-plays on the question side", function() {
      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      expect(card.speaker.speak).toHaveBeenCalledWith("front text", "EN")
      expect(card.dom.querySelector("#tts")).toBeHidden();
    });

    it("shows word & does NOT auto-play on the answer side", function() {
      var dom = createCardFrontAndBack();
      dom.querySelector(".card.front").id = "tts";
      card = new Card(dom, "MyDeckName", "MyNoteType", "MyCardType");
      spyOn(card.speaker, "speak");

      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      expect(card.speaker.speak).not.toHaveBeenCalled();
      expect(card.dom.querySelector("#tts")).not.toBeHidden();
    });

    it("does nothing if there is no TTS element", function() {
      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      card.dom.querySelector("#tts").id = null;
      card.speaker.speak.calls.reset();

      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      expect(card.speaker.speak).not.toHaveBeenCalled();
    });

    it("has a Speaker", function() {
      expect(card.speaker).not.toBeNull();
    });

    it("identifies languages from deck name", function() {
      expect(createCard("Language::Arabic").getLanguageCode()).toBe("AR");
      expect(createCard("Language::English").getLanguageCode()).toBe("EN");
      expect(createCard("Language::Español").getLanguageCode()).toBe("ES");
      expect(createCard("Language::Français").getLanguageCode()).toBe("FR");
      expect(createCard("Language::Japanese").getLanguageCode()).toBe("JA");
      expect(createCard("Language::Korean").getLanguageCode()).toBe("KO");
      expect(createCard("Language::Magyar").getLanguageCode()).toBe("HU");
      expect(createCard("Language::Русский").getLanguageCode()).toBe("RU");
    });

    it("identifies languages from deck name, ignoring extra subdecks", function() {
      expect(createCard("Language::Español::XYZ").getLanguageCode()).toBe("ES");
    });

    it("identifies language from TTS card type", function() {
      expect(createCard("deck", "note", "XX TTS").getLanguageCode()).toBe("XX");
    });

    it("identifies language from translation card type", function() {
      expect(createCard("deck", "note", "XX → YY").getLanguageCode()).toBe("YY");
      expect(createCard("deck", "note", "EN → YY").getLanguageCode()).toBe("YY");
      expect(createCard("deck", "note", "XX → EN").getLanguageCode()).toBe("XX");
    });

    describe("when the Speech API is unavailable", function() {
      var originalSpeechSynthesisUtterance;

      beforeEach(function() {
        originalSpeechSynthesisUtterance = SpeechSynthesisUtterance;
        SpeechSynthesisUtterance = null;
        card = new Card(dom, "MyDeckName", "MyNoteType", "MyCardType");
        spyOn(card.speaker, "speak");
      });

      afterEach(function() {
        SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
      });

      it("removes the TTS id", function() {
        expect(card.dom.querySelector("#tts")).toBeNull();
      });

      it("does NOT autoplay", function() {
        jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
        expect(card.speaker.speak).not.toHaveBeenCalled();
      });
    });
  });

  describe("sets up verb conjugations", function() {
    beforeEach(function() {
      spyOn(EnglishLanguage, "conjugate").and.callThrough();
      spyOn(FrenchLanguage, "conjugate").and.callThrough();
      EnglishLanguage.conjugate.calls.reset();
      FrenchLanguage.conjugate.calls.reset();
    });

    it("for French verb cards", function() {
      var dom = createCardFrontAndBack();
      var frVerb = dom.querySelector(".card.front");
      var enVerb = dom.querySelector(".card.back");
      frVerb.id = "fr-infinitive";
      enVerb.id = "en-infinitive";
      frVerb.innerText = "parler";
      enVerb.innerText = "to speak";

      card = new Card(dom, "MyDeckName", "Verbs: French", "1sgPres");

      expect(FrenchLanguage.conjugate).toHaveBeenCalledWith("parler", "1sg", "Pres");
      expect(EnglishLanguage.conjugate).toHaveBeenCalledWith("to speak", "1sg", "Pres");
      expect(frVerb.innerText).toBe("parle");
      expect(enVerb.innerText).toBe("speak");
    });

    it("ignores French NON-verb cards", function() {
      card = createCard("MyDeckName", "Verbs: French", "not a verb card actually");
      card.setupVerbs();

      expect(FrenchLanguage.conjugate).not.toHaveBeenCalled();
      expect(EnglishLanguage.conjugate).not.toHaveBeenCalled();
    });

    it("ignores non-French", function() {
      card = createCard("Verbs: Not-French", "1sgPres");
      card.setupVerbs();

      expect(FrenchLanguage.conjugate).not.toHaveBeenCalled();
      expect(EnglishLanguage.conjugate).not.toHaveBeenCalled();
    });
  });

  describe("root element", function() {
    beforeEach(function() {
      document.documentElement.className = "custom classes get removed";
      card = createCard();
    });

    it("#hasClasses()", function() {
      expect(card.hasClasses()).toBe(true);
    });

    it("#getClassList()", function() {
      expect(card.getClassList()).not.toContain("custom");
    });

    it("#setClasses() and #resetClasses()", function() {
      card.setClasses("foo");
      expect(card.getClassList()).toContain("foo");

      card.resetClasses();
      expect(card.getClassList()).not.toContain("foo");
    });
  });
});
