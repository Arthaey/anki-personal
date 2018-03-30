describe("Global", function() {
  it("sets up deck name", function() {
    var dom = createCardFrontAndBack();
    var startingHTML = dom.outerHTML;

    setup(dom, "MyDeckName", "MyNoteType", "MyCardType", "MyTags");

    expect(dom.outerHTML).not.toBe(startingHTML);
    expect(dom.querySelector("#deck")).toHaveText("MyDeckName");
  });
});
