describe("Global", function() {

  it("sets up short deck name", function() {
    var dom = createCardFrontAndBack();
    var startingHTML = dom.outerHTML;

    setup(dom, "MyDeckName::SubDeck", "MyNoteType", "MyCardType", "MyTags");

    expect(dom.outerHTML).not.toBe(startingHTML);
    expect(dom.querySelector("#deck")).toHaveText("SubDeck");
  });

});
