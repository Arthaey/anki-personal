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

    var timestamp = dom.querySelector("#file-generation-info");
    expect(timestamp).toContainText(`Javascript generated: ${FILE_GENERATION_TIMESTAMP}`);
  });

  it("shows last git sha", function() {
    LATEST_GIT_SHA = "abc123";

    var dom = createCardFrontAndBack();
    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    var timestamp = dom.querySelector("#file-generation-info");
    expect(timestamp).toContainText(LATEST_GIT_SHA);
  });

  it("shows when git working tree is dirty", function() {
    GIT_STATUS = "SOME STATUS";

    var dom = createCardFrontAndBack();
    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    var timestamp = dom.querySelector("#file-generation-info");
    expect(timestamp).toContainText(GIT_STATUS);
  });

  it("shows 'unknown' file generation info", function() {
    FILE_GENERATION_TIMESTAMP = null;
    LATEST_GIT_SHA = null;
    DIRTY_GIT_WORKING_TREE = null;

    var dom = createCardFrontAndBack();
    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    var timestamp = dom.querySelector("#file-generation-info");
    expect(timestamp).toContainText("Javascript generated: unknown");
  });

});
