/* global Speaker */

describe("Speaker", function() {
  var speaker;

  beforeEach(function() {
    speaker = new Speaker();

    spyOn(speechSynthesis, "speak");
    speechSynthesis.speak.calls.reset();
  });

  it("knows it can speak", function() {
    expect(speaker.canSpeak()).toBe(true);
  });

  it("has basic configuration values set", function() {
    speaker.speak("my text", "XX");

    expect(speechSynthesis.speak).toHaveBeenCalled();
    var utterance = lastUtterance();
    expect(utterance.volume).toBeCloseTo(speaker.defaultVolume);
    expect(utterance.rate).toBeCloseTo(speaker.defaultRate);
    expect(utterance.pitch).toBeCloseTo(speaker.defaultPitch);
  });

  it("uses a given language code", function() {
    speaker.speak("my text", "EN");

    expect(speechSynthesis.speak).toHaveBeenCalled();
    var utterance = lastUtterance();
    expect(utterance.text).toBe("my text");
    expect(utterance.lang).toBe("en-US");
  });

  it("only speaks one thing at a time", function() {
    spyOn(speechSynthesis, "cancel");
    speaker.speak("my text", "EN");
    speaker.speak("my text", "EN");
    expect(speechSynthesis.cancel).toHaveBeenCalled();
  });

  it("does not say anything inside slashes", function() {
    speaker.speak("word /wɹ̩d/", "EN");
    var utterance = lastUtterance();
    expect(utterance.text).toContain("word");
    expect(utterance.text).not.toContain("wɹ̩d");
  });

  it("does not say anything inside parentheses", function() {
    speaker.speak("some (hidden) stuff", "EN");
    expect(lastUtterance().text).toMatch(/^some +stuff$/);
  });

  it("handles dialogs");

  describe("language-specific", function() {
    describe("French", function() {
      it("pronounces '/' as 'ou'", function() {
        speaker.speak("foo/bar", "FR");
        expect(lastUtterance().text).toMatch(/^foo ou bar$/);
      });
    });

    describe("English", function() {
      it("pronounces '/' as 'or'", function() {
        speaker.speak("foo/bar", "EN");
        expect(lastUtterance().text).toMatch(/^foo or bar$/);
      });
    });

    describe("German", function() {
      it("pronounces '/' as 'oder'", function() {
        speaker.speak("foo/bar", "DE");
        expect(lastUtterance().text).toMatch(/^foo oder bar$/);
      });

      it("pronounces 'etw.' as 'etwas'", function() {
        speaker.speak("etw.", "DE");
        expect(lastUtterance().text).toMatch(/^etwas$/);
      });
    });

    describe("Spanish", function() {
      it("pronounces '/' as 'o'", function() {
        speaker.speak("foo/bar", "ES");
        expect(lastUtterance().text).toMatch(/^foo o bar$/);
      });

      it("says Spanish words that end in '(se)'", function() {
        speaker.speak("llamar(se)", "ES");
        expect(lastUtterance().text).toMatch(/^llamarse$/);
      });

      it("does not says Spanish cards that contain in '(se)'", function() {
        speaker.speak("llamar(se) así", "ES");
        expect(lastUtterance().text).toMatch(/^llamar +así$/);
      });

      it("does not says non-Spanish words that end in '(se)'", function() {
        speaker.speak("llamar(se)", "EN");
        expect(lastUtterance().text).toMatch(/^llamar$/);
      });

      it("speaks Spanish faster than the default speed", function() {
        speaker.speak("my text", "ES");
        expect(lastUtterance().rate).toBeGreaterThan(speaker.defaultRate);
      });
    });
  });

  describe("when Speech API is unavailable", function() {
    var originalSpeechSynthesisUtterance;

    beforeEach(function() {
      /* eslint-disable no-global-assign */
      originalSpeechSynthesisUtterance = SpeechSynthesisUtterance;
      SpeechSynthesisUtterance = null;
      /* eslint-enable no-global-assign */
    });

    afterEach(function() {
      /* eslint-disable-next-line no-global-assign */
      SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
    });

    it("knows it cannot speak", function() {
      expect(speaker.canSpeak()).toBe(false);
    });

    it("does not try to speak", function() {
      speaker.speak("my text", "EN");
      expect(speechSynthesis.speak).not.toHaveBeenCalled();
    });
  });

  describe("language and country codes", function() {
    it("defaults to same language and country code", function() {
      expect(speaker.getLanguageAndCountryCode("XX")).toBe("xx-XX");
    });

    it("substitutes country codes for special cases", function() {
      expect(speaker.getLanguageAndCountryCode("EN")).toBe("en-US");
      expect(speaker.getLanguageAndCountryCode("ES")).toBe("es-MX");
      expect(speaker.getLanguageAndCountryCode("JA")).toBe("ja-JP");
      expect(speaker.getLanguageAndCountryCode("KO")).toBe("ko-KR");
      expect(speaker.getLanguageAndCountryCode("ZH")).toBe("zh-CN");
    });
  });

  function lastUtterance() {
    return speechSynthesis.speak.calls.mostRecent().args[0];
  }
});
