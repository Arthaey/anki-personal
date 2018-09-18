/* global Card EnglishLanguage FrenchLanguage dom createCardFront */

describe("Card", function() {
  var card;

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
    expect(card.isQuestionSide()).toBe(true);
  });

  it("knows when it's on the answer side", function() {
    card = createCard({includeBack: true});
    expect(card.isQuestionSide()).toBe(false);
  });

  describe("check for expected HTML", function() {
    it("creates layout", function() {
      expect(card.hasExpectedLayout()).toBe(true);
    });

    it("missing layout", function() {
      var element = dom.createElement("container");
      var missingCard = createCard({domElement: element});
      expect(missingCard.hasExpectedLayout()).toBe(false);
    });

    it("does not add multiple card-info headers or debug elements", function() {
      var fullHtml = `
        <div class="card-info">
          <div class="tags">{{LeafTags}}</div>
          <div class="slash"></div>
          <div class="deck">
            <span id="deck">{{Deck}}</span>: <span class="card-type">{{Card}}</span>
          </div>
        </div>
        <div class="card front" id="tts">{{Front}}</div>
        <div id="debug" class="extra"></div>
      `;

      var element = dom.createElement("container");
      element.innerHTML = fullHtml;
      card = createCard({domElement: element});

      expect(card.dom.querySelectorAll(".card-info").length).toBe(1);
      expect(card.dom.querySelectorAll("#debug").length).toBe(1);
    });
  });

  describe("citations", function() {
    it("adds source from tag", function() {
      card = createCard({
        front: "<cite>p42</cite>",
        tags: "abc source::foo::bar xyz"
      });

      var citation = card.dom.querySelector("cite");
      expect(citation).toHaveText("Bar, p42");
    });

    it("truncates long URL citations", function() {
      card = createCard({
        front: "<cite>https://example.com/foo/bar/baz/long/url/testing#1234567890</cite>"
      });

      var citation = card.dom.querySelector("cite");
      expect(citation).toHaveText("example.com");
    });

    it("does NOT truncate short URL citations", function() {
      card = createCard({
        front: "<cite>https://example.com/foo</cite>"
      });

      var citation = card.dom.querySelector("cite");
      expect(citation).toHaveText("example.com/foo");
    });

    it("does NOT add citation when there is no tag source", function() {
      card = createCard({
        front: "<cite>p42</cite>",
        tags: "NoSourceTags"
      });

      var citation = card.dom.querySelector("cite");
      expect(citation).toHaveText("p42");
    });
  });

  describe("sets deck name", function() {
    it("to given name", function() {
      card = createCard({deck: "ExplicitlySetDeckName"});
      expect(card.dom.querySelector("#deck")).toHaveText("ExplicitlySetDeckName");
    });

    it("using only last portion of nested deck name", function() {
      card = createCard({deck: "Foo::Bar::MyDeckName"});
      var deck = card.dom.querySelector("#deck");
      expect(deck).toHaveText("MyDeckName");
      expect(deck).not.toHaveText("Foo");
      expect(deck).not.toHaveText("Bar");
    });
  });

  it("displays only leaf tags", function() {
    card = createCard({tags: "a::b c::d::e"});
    var tags = card.dom.querySelectorAll(".tag");
    expect(tags.length).toBe(2);
    expect(tags[0]).toHaveText("b");
    expect(tags[1]).toHaveText("e");
  });

  describe("sets CSS classes", function() {
    it("removes existing custom classes", function() {
      document.documentElement.className = "foo bar";
      card = createCard();
      expect(card.getClassList()).not.toContain("foo");
      expect(card.getClassList()).not.toContain("bar");
    });

    it("adds 'tts' for TTS cards", function() {
      card = createCard({deck: "deck-tts"});
      expect(card.getClassList()).toContain("tts");
    });

    it("adds 'asl' for ASL cards", function() {
      card = createCard({deck: "deck-asl"});
      expect(card.getClassList()).toContain("asl");
    });

    it("adds 'es-only' for monolingual Spanish clozes", function() {
      card = createCard({deck: "Foo::Español::Bar", note: "Cloze"});
      expect(card.getClassList()).toContain("es-only");
    });

    it("adds 'fr-only' for monolingual French clozes", function() {
      card = createCard({deck: "Foo::Français::Bar", note: "Cloze"});
      expect(card.getClassList()).toContain("fr-only");
    });

    it("adds 'de-only' for monolingual German clozes", function() {
      card = createCard({deck: "Foo::Deutsch::Bar", note: "Cloze"});
      expect(card.getClassList()).toContain("de-only");
    });

    it("does NOT add '*-only' for non-clozes", function() {
      card = createCard({deck: "Foo::Español::Bar", note: "not-Cloze"});
      expect(card.getClassList()).not.toContain("es-only");
    });

    it("adds non-English language for translation pair X → EN", function() {
      card = createCard({note: "not-Cloze", card: "ES → EN"});
      expect(card.getClassList()).toContain("es");
    });

    it("adds non-English language for translation pair EN → X", function() {
      card = createCard({note: "not-Cloze", card: "EN → ES"});
      expect(card.getClassList()).toContain("es");
    });

    it("adds 'small-text' to cards with long front text");

    it("adds each of deck/note/card/tag to classes too", function() {
      card = createCard({
        deck: "MyDeckName",
        note: "MyNoteType",
        card: "MyCardType",
        tags: "MyTags",
      });

      expect(card.getClassList()).toContain("mydeckname");
      expect(card.getClassList()).toContain("mynotetype");
      expect(card.getClassList()).toContain("mycardtype");
      expect(card.getClassList()).toContain("mytags");
    });

    it("makes lowercase", function() {
      card = createCard({card: "LOWERCASE"});
      expect(card.getClassList()).not.toContain("LOWERCASE");
      expect(card.getClassList()).toContain("lowercase");
    });

    it("replaces arrows with dashes", function() {
      card = createCard({card: "a → b", tags: "c ⇔ d"});
      expect(card.getClassList()).toContain("a-b");
      expect(card.getClassList()).toContain("c-d");
    });

    it("replaces spaces with dashes", function() {
      card = createCard({card: "a b"});
      expect(card.getClassList()).toContain("a-b");
    });

    it("replaces space-dash-space with a dash", function() {
      card = createCard({card: "a - b"});
      expect(card.getClassList()).toContain("a-b");
    });

    it("replaces subdeck-separators with dashes", function() {
      card = createCard({deck: "a::b"});
      expect(card.getClassList()).toContain("a-b");
    });

    it("replaces '-tts' with '-only'", function() {
      card = createCard({card: "es-tts"});
      expect(card.getClassList()).toContain("es-only");
    });

    it("ignores missing tags", function() {
      card = createCard({tags: undefined});
      expect(function() {
        card.setupClasses();
      }).not.toThrow();
    });

  });

  describe("TTS", function() {
    var dom;

    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    describe("for all card types", function() {
      beforeEach(function() {
        createTTSCard();
      });

      it("plays when clicked", function() {
        expect(card.speaker.speak).not.toHaveBeenCalled();
        card.dom.querySelector(".tts-trigger").click();
        expect(card.speaker.speak).toHaveBeenCalledWith("front text", "EN");
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
        expect(createCard({deck: "Language::Arabic"}).getLanguageCode()).toBe("AR");
        expect(createCard({deck: "Language::English"}).getLanguageCode()).toBe("EN");
        expect(createCard({deck: "Language::Español"}).getLanguageCode()).toBe("ES");
        expect(createCard({deck: "Language::Français"}).getLanguageCode()).toBe("FR");
        expect(createCard({deck: "Language::Japanese"}).getLanguageCode()).toBe("JA");
        expect(createCard({deck: "Language::Korean"}).getLanguageCode()).toBe("KO");
        expect(createCard({deck: "Language::Magyar"}).getLanguageCode()).toBe("HU");
        expect(createCard({deck: "Language::Русский"}).getLanguageCode()).toBe("RU");
      });

      it("identifies languages from deck name, ignoring extra subdecks", function() {
        expect(createCard({deck: "Language::Español::XYZ"}).getLanguageCode()).toBe("ES");
      });

      it("identifies language from TTS card type", function() {
        expect(createCard({card: "XX TTS"}).getLanguageCode()).toBe("XX");
      });

      it("identifies language from translation card type", function() {
        expect(createCard({card: "XX → YY"}).getLanguageCode()).toBe("YY");
        expect(createCard({card: "EN → YY"}).getLanguageCode()).toBe("YY");
        expect(createCard({card: "XX → EN"}).getLanguageCode()).toBe("XX");
      });

      describe("when the Speech API is unavailable", function() {
        var originalSpeechSynthesisUtterance;

        beforeEach(function() {
          originalSpeechSynthesisUtterance = SpeechSynthesisUtterance;
          /* eslint-disable-next-line no-global-assign */
          SpeechSynthesisUtterance = null;
          card = createCard();
          spyOn(card.speaker, "speak");
        });

        afterEach(function() {
          /* eslint-disable-next-line no-global-assign */
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

    describe("when it is a monolingual TTS card", function() {
      it("hides word & auto-plays on the question side", function() {
        createTTSCard({card: "MyCardTypeTTS"});
        jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
        expect(card.speaker.speak).toHaveBeenCalledWith("front text", "EN");
        expect(card.dom.querySelector("#tts")).toBeHidden();
      });

      it("shows word & does NOT auto-play on the answer side", function() {
        createTTSCard({card: "MyCardTypeTTS", includeBack: true});
        jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
        expect(card.speaker.speak).not.toHaveBeenCalled();
        expect(card.dom.querySelector("#tts")).not.toBeHidden();
      });
    });

    describe("when it is NOT a monolingual TTS card", function() {
      it("shows word & does NOT auto-play on the question side", function() {
        createTTSCard();
        jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
        expect(card.speaker.speak).not.toHaveBeenCalled();
        expect(card.dom.querySelector("#tts")).not.toBeHidden();
      });

      it("shows word & does NOT auto-play on the answer side", function() {
        createTTSCard({includeBack: true});
        jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
        expect(card.speaker.speak).not.toHaveBeenCalled();
        expect(card.dom.querySelector("#tts")).not.toBeHidden();
      });
    });

    function createTTSCard(params) {
      if (!params) params = {};
      params.cardId = "tts";
      params.front = "front text";

      card = createCard(params);
      spyOn(card.speaker, "speak");
    }
  });

  describe("sets up verb conjugations", function() {
    beforeEach(function() {
      spyOn(EnglishLanguage, "conjugate").and.callThrough();
      spyOn(FrenchLanguage, "conjugate").and.callThrough();
      EnglishLanguage.conjugate.calls.reset();
      FrenchLanguage.conjugate.calls.reset();
    });

    it("for French verb cards", function() {
      card = createCard({
        note: "Verbs: French",
        card: "1sgPres",
        front: "parler",
        frontId: "fr-infinitive",
        back: "to speak",
        backId: "en-infinitive",
        includeBack: true,
      });

      expect(FrenchLanguage.conjugate).toHaveBeenCalledWith("parler", "1sg", "Pres");
      expect(EnglishLanguage.conjugate).toHaveBeenCalledWith("to speak", "1sg", "Pres");
      expect(card.dom.querySelector(".card.front")).toHaveText("parle");
      expect(card.dom.querySelector(".card.back")).toHaveText("speak");
    });

    it("ignores French NON-verb cards", function() {
      card = createCard({deck: "Verbs: French", card: "not a verb card actually"});
      expect(FrenchLanguage.conjugate).not.toHaveBeenCalled();
      expect(EnglishLanguage.conjugate).not.toHaveBeenCalled();
    });

    it("ignores non-French", function() {
      card = createCard({deck: "Verbs: Not-French", card: "1sgPres"});
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
