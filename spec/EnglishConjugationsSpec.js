describe("English verbs", function() {
  describe("in the present tense", function() {
    var element;

    beforeEach(function() {
      element = dom.createElement("en-infinitive", "to speak");
    });

    it("should conjugate first-person singular ('I')", function() {
      setupEnglishVerb("1sg", "Pres");
      expect(element).toHaveText("speak");
    });

    it("should conjugate second-person singular ('you')", function() {
      setupEnglishVerb("2sg", "Pres");
      expect(element).toHaveText("speak");
    });

    it("should conjugate third-person singular ('s/he')", function() {
      setupEnglishVerb("3sg", "Pres");
      expect(element).toHaveText("speaks");
    });

    it("should conjugate first-person plural ('we')", function() {
      setupEnglishVerb("1pl", "Pres");
      expect(element).toHaveText("speak");
    });

    it("should conjugate second-person plural ('y'all')", function() {
      setupEnglishVerb("2pl", "Pres");
      expect(element).toHaveText("speak");
    });

    it("should conjugate third-person plural ('they')", function() {
      setupEnglishVerb("3pl", "Pres");
      expect(element).toHaveText("speak");
    });
  });
});
