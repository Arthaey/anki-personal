describe("FrenchLanguage", function() {
  var infinitive;
  var tense;

  describe("for -er verbs", function() {
    beforeEach(function() {
      infinitive = "parler";
    });

    describe("in the present tense", function() {
      beforeEach(function() {
        tense = "Pres";
      });

      it("should conjugate first-person singular ('je')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "1sg", tense)).toBe("parle");
      });

      it("should conjugate second-person singular ('tu')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "2sg", tense)).toBe("parles");
      });

      it("should conjugate third-person singular ('elle')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "3sg", tense)).toBe("parle");
      });

      it("should conjugate first-person plural ('nous')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "1pl", tense)).toBe("parlons");
      });

      it("should conjugate second-person plural ('vous')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "2pl", tense)).toBe("parlez");
      });

      it("should conjugate third-person plural ('elles')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "3pl", tense)).toBe("parlent");
      });
    });
  });

  describe("for -ir verbs", function() {
    beforeEach(function() {
      infinitive = "choisir";
    });

    describe("in the present tense", function() {
      beforeEach(function() {
        tense = "Pres";
      });

      it("should conjugate first-person singular ('je')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "1sg", tense)).toBe("choisis");
      });

      it("should conjugate second-person singular ('tu')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "2sg", tense)).toBe("choisis");
      });

      it("should conjugate third-person singular ('elle')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "3sg", tense)).toBe("choisit");
      });

      it("should conjugate first-person plural ('nous')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "1pl", tense)).toBe("choisissons");
      });

      it("should conjugate second-person plural ('vous')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "2pl", tense)).toBe("choisissez");
      });

      it("should conjugate third-person plural ('elles')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "3pl", tense)).toBe("choisissent");
      });
    });
  });

  describe("for -re verbs", function() {
    beforeEach(function() {
      infinitive = "vendre";
    });

    describe("in the present tense", function() {
      beforeEach(function() {
        tense = "Pres";
      });

      it("should conjugate first-person singular ('je')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "1sg", tense)).toBe("vends");
      });

      it("should conjugate second-person singular ('tu')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "2sg", tense)).toBe("vends");
      });

      it("should conjugate third-person singular ('elle')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "3sg", tense)).toBe("vend");
      });

      it("should conjugate first-person plural ('nous')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "1pl", tense)).toBe("vendons");
      });

      it("should conjugate second-person plural ('vous')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "2pl", tense)).toBe("vendez");
      });

      it("should conjugate third-person plural ('elles')", function() {
        expect(FrenchLanguage.conjugate(infinitive, "3pl", tense)).toBe("vendent");
      });
    });
  });
});
