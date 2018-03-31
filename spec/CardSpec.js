describe("Card", function() {
  var card;

  function createCard(deckName, noteType) {
    if (!deckName) deckName = "MyDeckName";
    if (!noteType) noteType = "MyNoteType";
    return new Card(createCardFront(), deckName, noteType, "MyCardType");
  }

  beforeEach(function() {
    card = createCard();
  });

  afterEach(function() {
      document.documentElement.className = "";
  });

  it("constructor", function() {
    card = new Card(createCardFront(), "MyDeckName", "MyNoteType", "MyCardType", "MyTags");
    expect(card.dom.innerHTML).toBe(cardFrontHTML());
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
      card.setupDeckName("MyDeckName");
      expect(card.dom.querySelector("#deck")).toHaveText("MyDeckName");
    });

    it("using only last portion of nested deck name", function() {
      var htmlBefore = card.dom.outerHTML;
      card.setupDeckName("Foo::Bar::MyDeckName");

      var deck = card.dom.querySelector("#deck");
      expect(deck).toHaveText("MyDeckName");
      expect(deck).not.toHaveText("Foo");
      expect(deck).not.toHaveText("Bar");
    });

    it("ignores missing element", function() {
      card.dom.querySelector("#deck").remove();
      var htmlBefore = card.dom.outerHTML;
      card.setupDeckName();
      expect(card.dom.outerHTML).toBe(htmlBefore);
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
    // <div id="tts" class="card front hidden outlined">{{Français}}</div>

    beforeEach(function() {
      jasmine.clock().install();

      var dom = createCardFront();
      var cardFront = dom.querySelector(".card.front");
      cardFront.id = "tts";
      cardFront.innerText = "front text";
      card = new Card(dom, "MyDeckName", "MyNoteType", "MyCardType");

      spyOn(card.speaker, "speak");
      card.speaker.speak.calls.reset();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("plays when clicked", function() {
      card.setupTTS();
      card.dom.querySelector("#tts").click();
      expect(card.speaker.speak).toHaveBeenCalledWith("front text")
    });

    it("hides word & auto-plays on the question side", function() {
      card.setupTTS();
      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      expect(card.speaker.speak).toHaveBeenCalledWith("front text")
      expect(card.dom.querySelector("#tts")).toBeHidden();
    });

    it("shows word & does NOT auto-play on the answer side", function() {
      var dom = createCardFrontAndBack();
      dom.querySelector(".card.front").id = "tts";
      card = new Card(dom, "MyDeckName", "MyNoteType", "MyCardType");
      spyOn(card.speaker, "speak");

      card.setupTTS();

      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      expect(card.speaker.speak).not.toHaveBeenCalled();
      expect(card.dom.querySelector("#tts")).not.toBeHidden();
    });

    it("does nothing if there is no TTS element", function() {
      card.dom.querySelector("#tts").id = null;
      card.setupTTS();
      jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
      expect(card.speaker.speak).not.toHaveBeenCalled();
    });

    it("has a Speaker", function() {
      expect(card.speaker).not.toBeNull();
    });

    describe("when the Speech API is unavailable", function() {
      var originalSpeechSynthesisUtterance;

      beforeEach(function() {
        originalSpeechSynthesisUtterance = SpeechSynthesisUtterance;
        SpeechSynthesisUtterance = null;
      });

      afterEach(function() {
        SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
      });

      it("removes the TTS id", function() {
        card.setupTTS();
        expect(card.dom.querySelector("#tts")).toBeNull();
        expect(card.speaker.speak).not.toHaveBeenCalled();
      });

      it("does NOT autoplay", function() {
        card.setupTTS();
        jasmine.clock().tick(Card.ttsAutoPlayDelay + 1);
        expect(card.speaker.speak).not.toHaveBeenCalled();
      });
    });
  });

  describe("root element", function() {
    describe("when it has classes", function() {
      beforeEach(function() {
        document.documentElement.className = "foo bar";
        card = createCard();
      });

      it("#hasClasses()", function() {
        expect(card.hasClasses()).toBe(true);
      });

      it("#getClassList()", function() {
        expect(card.getClassList().length).toBe(2);
        expect(card.getClassList()).toContain("foo");
        expect(card.getClassList()).toContain("bar");
      });

      it("#removeCustomClasses()", function() {
        expect(card.hasClasses()).toBe(true);
        card.removeCustomClasses();
        expect(card.hasClasses()).toBe(false);
      });
    });

    describe("when it does NOT have classes", function() {
      beforeEach(function() {
        document.documentElement.className = "";
      });

      it("#hasClasses()", function() {
        expect(card.hasClasses()).toBe(false);
      });

      it("#getClassList()", function() {
        expect(card.getClassList().length).toBe(0);
      });

      it("#removeCustomClasses()", function() {
        expect(card.hasClasses()).toBe(false);
        card.removeCustomClasses();
        expect(card.hasClasses()).toBe(false);
      });
    });
  });
});
