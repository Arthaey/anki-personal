describe("French verbs", function() {
  var element;
  var tense;

  afterEach(function() {
    dom.cleanup();
  });

  describe("for -er verbs", function() {
    beforeEach(function() {
      element = dom.createElement("fr-infinitive", "parler");
    });

    describe("in the present tense", function() {
      beforeEach(function() {
        tense = "Pres";
      });

      it("should conjugate first-person singular ('je')", function() {
        setupFrenchVerb("1sg", tense);
        expect(element).toHaveText("parle");
      });

      it("should conjugate second-person singular ('tu')", function() {
        setupFrenchVerb("2sg", tense);
        expect(element).toHaveText("parles");
      });

      it("should conjugate third-person singular ('elle')", function() {
        setupFrenchVerb("3sg", tense);
        expect(element).toHaveText("parle");
      });

      it("should conjugate first-person plural ('nous')", function() {
        setupFrenchVerb("1pl", tense);
        expect(element).toHaveText("parlons");
      });

      it("should conjugate second-person plural ('vous')", function() {
        setupFrenchVerb("2pl", tense);
        expect(element).toHaveText("parlez");
      });

      it("should conjugate third-person plural ('elles')", function() {
        setupFrenchVerb("3pl", tense);
        expect(element).toHaveText("parlent");
      });
    });
  });

  describe("for -ir verbs", function() {
    beforeEach(function() {
      element = dom.createElement("fr-infinitive", "choisir");
    });

    describe("in the present tense", function() {
      beforeEach(function() {
        tense = "Pres";
      });

      it("should conjugate first-person singular ('je')", function() {
        setupFrenchVerb("1sg", tense);
        expect(element).toHaveText("choisis");
      });

      it("should conjugate second-person singular ('tu')", function() {
        setupFrenchVerb("2sg", tense);
        expect(element).toHaveText("choisis");
      });

      it("should conjugate third-person singular ('elle')", function() {
        setupFrenchVerb("3sg", tense);
        expect(element).toHaveText("choisit");
      });

      it("should conjugate first-person plural ('nous')", function() {
        setupFrenchVerb("1pl", tense);
        expect(element).toHaveText("choisissons");
      });

      it("should conjugate second-person plural ('vous')", function() {
        setupFrenchVerb("2pl", tense);
        expect(element).toHaveText("choisissez");
      });

      it("should conjugate third-person plural ('elles')", function() {
        setupFrenchVerb("3pl", tense);
        expect(element).toHaveText("choisissent");
      });
    });
  });

  describe("for -re verbs", function() {
    beforeEach(function() {
      element = dom.createElement("fr-infinitive", "vendre");
    });

    describe("in the present tense", function() {
      beforeEach(function() {
        tense = "Pres";
      });

      it("should conjugate first-person singular ('je')", function() {
        setupFrenchVerb("1sg", tense);
        expect(element).toHaveText("vends");
      });

      it("should conjugate second-person singular ('tu')", function() {
        setupFrenchVerb("2sg", tense);
        expect(element).toHaveText("vends");
      });

      it("should conjugate third-person singular ('elle')", function() {
        setupFrenchVerb("3sg", tense);
        expect(element).toHaveText("vend");
      });

      it("should conjugate first-person plural ('nous')", function() {
        setupFrenchVerb("1pl", tense);
        expect(element).toHaveText("vendons");
      });

      it("should conjugate second-person plural ('vous')", function() {
        setupFrenchVerb("2pl", tense);
        expect(element).toHaveText("vendez");
      });

      it("should conjugate third-person plural ('elles')", function() {
        setupFrenchVerb("3pl", tense);
        expect(element).toHaveText("vendent");
      });
    });
  });
});
