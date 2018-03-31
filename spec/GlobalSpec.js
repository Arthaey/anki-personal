describe("Global", function() {

  it("sets up deck name", function() {
    var dom = createCardFrontAndBack();
    var startingHTML = dom.outerHTML;

    setup(dom, "MyDeckName", "MyNoteType", "MyCardType", "MyTags");

    expect(dom.outerHTML).not.toBe(startingHTML);
    expect(dom.querySelector("#deck")).toHaveText("MyDeckName");
  });

  it("sets up CSS class names", function() {
    var dom = createCardFrontAndBack();

    setup(dom, "A::Español::C", "Cloze", "X → Y", "LOWERCASE");

    expect(document.documentElement.classList).toContain("lowercase");
    expect(document.documentElement.classList).toContain("es-only");
    expect(document.documentElement.classList).toContain("x-y");
  });

});
