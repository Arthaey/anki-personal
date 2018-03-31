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
    speaker.speak("my text", "EN");

    expect(speechSynthesis.speak).toHaveBeenCalled();
    var utterance = speechSynthesis.speak.calls.mostRecent().args[0];
    expect(utterance.volume).toBeCloseTo(speaker.volume);
    expect(utterance.rate).toBeCloseTo(speaker.rate);
    expect(utterance.pitch).toBeCloseTo(speaker.pitch);
  });

  it("uses a given language code", function() {
    speaker.speak("my text", "EN");

    expect(speechSynthesis.speak).toHaveBeenCalled();
    var utterance = speechSynthesis.speak.calls.mostRecent().args[0];
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
    var utterance = speechSynthesis.speak.calls.mostRecent().args[0];
    expect(utterance.text).toContain("word");
    expect(utterance.text).not.toContain("wɹ̩d");
  });


  it("does not say anything inside parentheses", function() {
    speaker.speak("some (hidden) stuff", "EN");
    var utterance = speechSynthesis.speak.calls.mostRecent().args[0];
    expect(utterance.text).toMatch(/^some +stuff$/);
  });

  describe("when Speech API is unavailable", function() {
    var originalSpeechSynthesisUtterance;

    beforeEach(function() {
      originalSpeechSynthesisUtterance = SpeechSynthesisUtterance;
      SpeechSynthesisUtterance = null;
    });

    afterEach(function() {
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
      expect(speaker.getLanguageAndCountryCode("Xx")).toBe("xx-XX");
    });

    it("substitutes country codes for special cases", function() {
      expect(speaker.getLanguageAndCountryCode("EN")).toBe("en-US");
      expect(speaker.getLanguageAndCountryCode("ES")).toBe("es-MX");
      expect(speaker.getLanguageAndCountryCode("JA")).toBe("ja-JP");
      expect(speaker.getLanguageAndCountryCode("KO")).toBe("ko-KR");
      expect(speaker.getLanguageAndCountryCode("ZH")).toBe("zh-CN");
    });
  });
});
