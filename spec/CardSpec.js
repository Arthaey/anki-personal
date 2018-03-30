describe("Card", function() {
  var card;

  function createCard(deckName) {
    if (!deckName) {
      deckName = "MyDeckName";
    }
    return new Card(createCardFront(), deckName, "MyNoteType", "MyCardType", "MyTags");
  }

  beforeEach(function() {
    card = createCard();
  });

  afterEach(function() {
      document.documentElement.className = "";
  });

  it("constructor", function() {
    expect(card.dom.innerHTML).toBe(cardFrontHTML());
    expect(card.deckName).toBe("MyDeckName");
    expect(card.noteType).toBe("MyNoteType");
    expect(card.cardType).toBe("MyCardType");
    expect(card.tags).toBe("MyTags");
  });

  describe("check for expected HTML", function() {
    it("finds layout", function() {
      expect(card.hasExpectedLayout()).toBe(true);
    });

    it("missing layout", function() {
      var element = dom.createElement("container");
      var missingCard = new Card(element, "MyDeckName", "MyNoteType", "MyCardType", "MyTags");
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
      card = createCard("Foo::Español::Bar");
      card.setupClasses();
      expect(card.getClassList()).toContain("es-only");
    });

    it("adds 'fr-only' for monolingual French clozes");
    it("adds 'de-only' for monolingual German clozes");
    it("does NOT add '*-only' for non-clozes");
    it("makes lowercase");
    it("replaces arrows with dashes");
    it("replaces spaces with dashes");
    it("replaces subdeck-separators with dashes");
    it("replaces '-tts' with '-only'");
    it("based on deck name");
    it("based on note type");
    it("based on card type");
    it("based on tags");
    it("for multiple cases at the same time");
    it("ignores missing element");
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
