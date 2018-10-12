/* global GermanLanguage */

describe("GermanLanguage", function() {
  it("creates a plural for masculine nouns", function() {
    expect(GermanLanguage.pluralize("der Hund, –e")).toBe("der Hund, die Hunde");
  });

  it("creates a plural for feminine nouns", function() {
    expect(GermanLanguage.pluralize("die Katze, –n")).toBe("die Katze, die Katzen");
  });

  it("creates a plural for neuter nouns", function() {
    expect(GermanLanguage.pluralize("das Tier, –e")).toBe("das Tier, die Tiere");
  });

  it("creates a plural with just an umlaut change", function() {
    expect(GermanLanguage.pluralize("die Mutter, –¨")).toBe("die Mutter, die Mütter");
  });

  it("creates a plural with an umlaut and suffix", function() {
    expect(GermanLanguage.pluralize("der Wurm, –¨er")).toBe("der Wurm, die Würmer");
  });

  it("creates a plural with no change", function() {
    expect(GermanLanguage.pluralize("der Liter, –")).toBe("der Liter, die Liter");
  });

  it("does nothing if no plural suffix is provided", function() {
    expect(GermanLanguage.pluralize("der Hund")).toBe("der Hund");
  });

  it("does nothing if it's not a noun + suffix", function() {
    expect(GermanLanguage.pluralize("foo, bar")).toBe("foo, bar");
  });
});