describe("Style", function() {
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
        var flagRegex = new RegExp(`${langCode}.png`);
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

  function createCard(cardType) {
    var frontHtml = cardFrontHTML();
    frontHtml = replaceAnkiVariable(frontHtml, "Front", "front question");
    frontHtml = replaceAnkiVariable(frontHtml, "Card", cardType);

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
    setup(cardEl, "MyDeck", "MyNote", cardType, "MyTags");
    return cardEl;
  }

});
