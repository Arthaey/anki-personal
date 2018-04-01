describe("EnglishLanguage", function() {
  describe("verbs in the present tense", function() {
    it("should conjugate first-person singular ('I')", function() {
      expect(EnglishLanguage.conjugate("to speak", "1sg", "Pres")).toBe("speak");
    });

    it("should conjugate second-person singular ('you')", function() {
      expect(EnglishLanguage.conjugate("to speak", "2sg", "Pres")).toBe("speak");
    });

    it("should conjugate third-person singular ('s/he')", function() {
      expect(EnglishLanguage.conjugate("to speak", "3sg", "Pres")).toBe("speaks");
    });

    it("should conjugate first-person plural ('we')", function() {
      expect(EnglishLanguage.conjugate("to speak", "1pl", "Pres")).toBe("speak");
    });

    it("should conjugate second-person plural ('y'all')", function() {
      expect(EnglishLanguage.conjugate("to speak", "2pl", "Pres")).toBe("speak");
    });

    it("should conjugate third-person plural ('they')", function() {
      expect(EnglishLanguage.conjugate("to speak", "3pl", "Pres")).toBe("speak");
    });
  });
});
