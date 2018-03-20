describe("Card", function() {
  var card;

  beforeEach(function() {
    card = new Card(createCardFront());
  });

  afterEach(function() {
    dom.cleanup();
  });

  describe("check for expected HTML", function() {
    it("finds layout", function() {
      expect(card.hasExpectedLayout()).toBe(true);
    });

    it("missing layout", function() {
      var element = dom.createElement("container");
      var missingCard = new Card(element);
      expect(missingCard.hasExpectedLayout()).toBe(false);
    });
  });

  describe("has DOM elements", function() {
    it("given in the constructor", function() {
      expect(card.dom.innerHTML).toBe(cardFrontHTML());
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

  function createCardFront() {
    var element = dom.createElement("container");
    element.innerHTML = cardFrontHTML();
    return element;
  }

  function createCardFrontAndBack() {
    var element = createCardFront();
    element.innerHTML += cardBackHTML();
    return element;
  }

	function cardFrontHTML() {
    return `
      <div class="card-info">
        {{#LeafTags}}<div class="tags">{{LeafTags}}</div>{{/LeafTags}}
        <div class="deck">
          <span id="deck">{{Deck}}</span>: <span class="card-type">{{Card}}</span>
        </div>
        <div class="slash"></div>
      </div>
      <div class="card front">{{Front}}</div>
      <div id="debug" class="extra"></div>
      `;
  }

	function cardBackHTML() {
    return `
      <!-- -------------------- --> <hr id="answer"> <!-- -------------------- -->
      <div class="card back">{{Back}}</div>
      `;
  }
});
