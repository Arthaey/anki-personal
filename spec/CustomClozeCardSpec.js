/* global createCard */

xdescribe("CustomClozeCard", function() {
  beforeEach(function() {
    document.documentElement.className = "";
  });

  it("parses basic cloze syntax", function() {
    var card = createCustomClozeCard({ front: "abc {{c1::def}} ghi" });
    expect(card.front).toHaveText("abc [__] ghi");
    expect(card.back).toHaveText("abc def ghi");
  });

  it("parses multiple clozes of the same number", function() {
    var card = createCustomClozeCard({ front: "abc {{c1::def}} {{c1::ghi}}" });
    expect(card.front).toHaveText("abc [__] [__]");
    expect(card.back).toHaveText("abc def ghi");
  });

  it("parses multiple clozes of different numbers", function() {
    var card1 = createCustomClozeCard({ front: "abc {{c1::def}} {{c2::ghi}}", card: "c1" });
    var card2 = createCustomClozeCard({ front: "abc {{c1::def}} {{c2::ghi}}", card: "c2" });

    expect(card1.front).toHaveText("abc [__] ghi");
    expect(card1.back).toHaveText("abc def ghi");

    expect(card2.front).toHaveText("abc def [__]");
    expect(card2.back).toHaveText("abc def ghi");
  });

  it("parses hints", function() {
    var card = createCustomClozeCard({ front: "abc {{c1::def::hint}}" });
    expect(card.front).toHaveText("abc [hint] ghi");
    expect(card.back).toHaveText("abc def ghi");
  });

  it("parses multi-word and HTML words", function() {
    var card = createCustomClozeCard({ front: "abc {{c1::def <i>ghi</i>::hint that's <b>HTML</b>ified}}" });
    expect(card.front).toHaveText("abc [hint that's HTMLified] ghi");
    expect(card.back).toHaveText("abc def ghi");
  });

  it("sets TTS to just the sentence containing the cloze text");

  it("sets TTS to multiple sentences if there are multiple clozes with the same number");

  function createCustomClozeCard(params) {
    var defaultParams = {
      note: "Custom Cloze",
      card: "c1",
      includeBack: true,
    };
    return createCard(Object.apply(defaultParams, params));
  }
});