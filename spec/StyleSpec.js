/* global createCardAsElement */

describe("Style", function() {
  it("file generation information is hidden", function() {
    var cardEl = createCardAsElement();
    var info = cardEl.querySelector("#file-generation-info");
    expect(info).toHaveComputedColor("color", "rgba(0, 0, 0, 0)");
    expect(info).toHaveComputedStyle("font-size", "24px");
  });

  it("handles long tags", function() {
    var longTags = "long-tags ".repeat(40);
    var cardEl = createCardAsElement({ card: "MyCard::MyCard::MyCard::MyCard", tags: longTags });

    var header = cardEl.querySelector(".card-info");
    var headerHeight = getComputedStyle(header).getPropertyValue("height");

    var slash = cardEl.querySelector(".slash");
    var slashHeight = getComputedStyle(slash).getPropertyValue("border-bottom-width");

    expect(headerHeight).toBe(slashHeight);
  });

  describe("'default' card", function() {
    it("center-aligns text", function() {
      var cardEl = createCardAsElement();
      expect(cardEl.querySelector(".card")).toHaveComputedStyle("text-align", "center");
    });

    it("makes 'small-text' smaller", function() {
      var cardEl = createCardAsElement({ tags: "style::small-text" });
      expect(cardEl.querySelector(".card.front")).toHaveComputedStyle("font-size", "24px");
    });
  });

  describe("topic icons", function() {
    it("shows a globe icon for geography tags", function() {
      var cardEl = createCardAsElement({ tags: "topics::geography::state" });
      var cardTypeEl = cardEl.querySelector(".card-type");
      var regex = new RegExp("_topics-geography.png");
      expect(cardTypeEl).toHaveComputedStyle("content", regex, ":after");
    });

    it("shows a sailboat icon for sailing tags", function() {
      var cardEl = createCardAsElement({ tags: "topics::sailing" });
      var cardTypeEl = cardEl.querySelector(".card-type");
      var regex = new RegExp("_topics-sailing.png");
      expect(cardTypeEl).toHaveComputedStyle("content", regex, ":after");
    });
  });

  describe("cloze cards", function() {
    it("left-aligns text", function() {
      var cardEl = createCardAsElement({ card: "Cloze" });
      expect(cardEl.querySelector(".card")).toHaveComputedStyle("text-align", "left");
    });
  });

  var supportedLanguages = [
    { code: "DE", color: "#b43c3c" },
    { code: "ES", color: "#3eb43c" },
    { code: "FR", color: "#3c8fb4" },
    { code: "HU", color: "#0e2b0e" },
    { code: "JA", color: "#b43c3c" },
  ];

  describe("monolingual cards", function() {
    supportedLanguages.forEach(function(lang) {
      describe(`${lang.code} ↔ EN`, function() {
        headerHasSolidColor(lang.code);
        deckNameHasBackgroundColor(lang.code, lang.color);
        deckNameHasBackgroundColor(`${lang.code} TTS`, lang.color);
        showsFlag(lang.code, lang.code.toLowerCase());
        showsSpeakerIcon(lang.code);
      });
    });

    function headerHasSolidColor(cardType) {
      it(`header has a solid color (${cardType})`, function() {
        var cardEl = createCardAsElement({ card: cardType });
        var header = cardEl.querySelector(".card-info");
        expect(header).not.toHaveComputedStyle("background", /linear-gradient/);
      });
    }
  });

  describe("bilingual cards", function() {
    supportedLanguages.forEach(function(lang) {
      var pairAB = `${lang.code} → EN`;
      var pairBA = `EN → ${lang.code}`;

      describe(`${lang.code} ↔ EN`, function() {
        headerHasGradient(pairAB);
        headerHasGradient(pairBA);
        deckNameHasBackgroundColor(pairAB, lang.color);
        deckNameHasBackgroundColor(pairBA, lang.color);
        showsFlag(pairAB, lang.code.toLowerCase());
        showsFlag(pairBA, lang.code.toLowerCase());
        showsSpeakerIcon(pairAB);
        showsSpeakerIcon(pairBA);
      });
    });

    function headerHasGradient(cardType) {
      it(`header has a gradient (${cardType})`, function() {
        var cardEl = createCardAsElement({ card: cardType });
        var header = cardEl.querySelector(".card-info");
        expect(header).toHaveComputedStyle("background", /linear-gradient/);
      });
    }
  });

  function deckNameHasBackgroundColor(cardType, color) {
    it(`deck name has a background color (${cardType})`, function() {
      var cardEl = createCardAsElement({ card: cardType });
      var header = cardEl.querySelector(".deck");
      expect(header).toHaveComputedColor("background-color", color);
    });
  }

  function showsFlag(cardType, langCode) {
    it(`shows the flag (${cardType})`, function() {
      var cardEl = createCardAsElement({ card: cardType });
      var cardTypeEl = cardEl.querySelector(".card-type");
      var regex = new RegExp(`_flag-${langCode}.png`);
      expect(cardTypeEl).toHaveComputedStyle("content", regex, ":after");
    });
  }

  function showsSpeakerIcon(cardType) {
    it(`shows speaker icon (${cardType})`, function() {
      var cardEl = createCardAsElement({ card: cardType });
      var tts = cardEl.querySelector(".tts-trigger");
      expect(tts).toHaveComputedStyle("background-image", /speaker-32x32.png/);
    });
  }

});
