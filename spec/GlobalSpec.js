describe("Global", function() {

  it("sets up short deck name", function() {
    var dom = createCardFrontAndBack();
    var startingHTML = dom.outerHTML;

    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    expect(dom.outerHTML).not.toBe(startingHTML);
    expect(dom.querySelector("#deck")).toHaveText("SubDeck");
  });

  it("shows given file generation timestamp", function() {
    FILE_GENERATION_TIMESTAMP = 'Thu Sep 6 22:25:02 PDT 2018';

    var dom = createCardFrontAndBack();
    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    var timestamp = dom.querySelector("#file-generation-timestamp");
    expect(timestamp).toHaveText(`Javascript generated: ${FILE_GENERATION_TIMESTAMP}`);
  });

  it("shows 'uknown' file generation timestamp", function() {
    FILE_GENERATION_TIMESTAMP = null;

    var dom = createCardFrontAndBack();
    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    var timestamp = dom.querySelector("#file-generation-timestamp");
    expect(timestamp).toHaveText("Javascript generated: unknown");
  });

});
