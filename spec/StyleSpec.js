describe("Style", function() {
  it("file generation information is hidden", function() {
    var cardEl = createCard();
    var info = cardEl.querySelector("#file-generation-info");
    expect(info).toHaveComputedColor("color", "rgba(0, 0, 0, 0)");
    expect(info).toHaveComputedStyle("font-size", "24px");
  });

  it("handles long tags", function() {
    var longTags = "long-tags ".repeat(40);
    var cardEl = createCard("MyCard::MyCard::MyCard::MyCard", longTags);

    var header = cardEl.querySelector(".card-info");
    var headerHeight = getComputedStyle(header).getPropertyValue("height");

    var slash = cardEl.querySelector(".slash");
    var slashHeight = getComputedStyle(slash).getPropertyValue("border-bottom-width");

    expect(headerHeight).toBe(slashHeight);
  });

  describe("'default' cards", function() {
    it("center-aligns text", function() {
      var cardEl = createCard("MyCard");
      expect(cardEl.querySelector(".card")).toHaveComputedStyle("text-align", "center");
    });
  });

  describe("cloze cards", function() {
    it("left-aligns text", function() {
      var cardEl = createCard("Cloze");
      expect(cardEl.querySelector(".card")).toHaveComputedStyle("text-align", "left");
    });

    it("adds quotation marks in the background", function() {
      var cardEl = createCard("Cloze");
      var front = cardEl.querySelector(".card.front");
      expect(front).toHaveComputedStyle("content", '"“"', ":before");
      expect(front).toHaveComputedStyle("content", '"”"', ":after");
    });
  });

  describe("bilingual cards", function() {

    var supportedLanguages = [
      { code: "DE", color: "#b43c3c" },
      { code: "ES", color: "#3eb43c" },
      { code: "FR", color: "#3c8fb4" },
      { code: "HU", color: "#0e2b0e" },
      { code: "JA", color: "#b43c3c" },
    ];

    supportedLanguages.forEach(function(lang) {
      var pairAB = `${lang.code} → EN`;
      var pairBA = `EN → ${lang.code}`;

      describe(`${lang.code} ↔ EN`, function() {
        headerHasGradient(pairAB);
        headerHasGradient(pairBA);
        deckNameHasBackgroundColor(pairAB, lang.color);
        deckNameHasBackgroundColor(pairBA, lang.color);
        deckNameHasBackgroundColor(`${lang.code} TTS`, lang.color);
        showsFlag(pairAB, lang.code.toLowerCase());
        showsFlag(pairBA, lang.code.toLowerCase());
        showsSpeakerIcon(pairAB);
        showsSpeakerIcon(pairBA);
      });
    });

    function headerHasGradient(cardType) {
      it(`header has a gradient (${cardType})`, function() {
        var cardEl = createCard(cardType);
        var header = cardEl.querySelector(".card-info");
        expect(header).toHaveComputedStyle("background", /linear-gradient/);
      });
    }

    function deckNameHasBackgroundColor(cardType, color) {
      it(`deck name has a background color (${cardType})`, function() {
        var cardEl = createCard(cardType);
        var header = cardEl.querySelector(".deck");
        expect(header).toHaveComputedColor("background-color", color);
      });
    }

    function showsFlag(cardType, langCode) {
      it(`shows the flag (${cardType})`, function() {
        var cardEl = createCard(cardType);
        var flag = cardEl.querySelector(".card-type");
        var flagRegex = new RegExp(`_flag-${langCode}.png`);
        expect(flag).toHaveComputedStyle("content", flagRegex, ":after");
      });
    }

    function showsSpeakerIcon(cardType) {
      it(`shows speaker icon (${cardType})`, function() {
        var cardEl = createCard(cardType);
        var tts = cardEl.querySelector(".tts-trigger");
        expect(tts).toHaveComputedStyle("background-image", /speaker-32x32.png/);
      });
    }

  });

  function createCard(cardType, tags) {
    if (!cardType) cardType = "MyCard";
    if (!tags) tags = "MyTags";

    var frontHtml = cardFrontHTML();
    frontHtml = replaceAnkiVariable(frontHtml, "Front", "front question");
    frontHtml = replaceAnkiVariable(frontHtml, "Card", cardType);
    frontHtml = replaceAnkiVariable(frontHtml, "LeafTags", tags);

    var backHtml = cardBackHTML();
    backHtml = replaceAnkiVariable(backHtml, "Back", "back answer");

    var html = `
      <html class="webkit safari mac js">
        <body class="card card2">
          <div id="qa">
            ${frontHtml}
            ${backHtml}
          </div>
        </body>
      </html>
    `;

    var cardEl = dom.createElement('testId', 'default content', { html: html });
    setup(cardEl, "MyDeck", "MyNote", cardType, tags);
    return cardEl;
  }

});
