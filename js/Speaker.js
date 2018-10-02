/* global appendDebug */

function Speaker() {
  this.defaultVolume = 1; // 0 to 1
  this.defaultRate = 0.9; // 0.1 to 9
  this.defaultPitch = 1; // 0 to 2, 1=normal

  appendDebug("Speaker created; it can" + (this.canSpeak() ? "" : "not") + " speak.");
}

Speaker.prototype.canSpeak = function() {
  return typeof SpeechSynthesisUtterance !== "undefined" && !!SpeechSynthesisUtterance;
};

Speaker.prototype.speak = function(text, languageCode) {
  if (!this.canSpeak()) return;
  var utterance = new SpeechSynthesisUtterance();
  utterance.text = this.normalizeText(text, languageCode);
  utterance.lang = this.getLanguageAndCountryCode(languageCode);
  utterance.volume = this.defaultVolume;
  utterance.rate = this.getSpeechRate(languageCode);
  utterance.pitch = this.defaultPitch;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

Speaker.prototype.normalizeText = function(text, languageCode) {
  var specialReplacements = {
    "DE": { "/": " oder " },
    "EN": { "/": " or " },
    "ES": { "/": " o " },
    "FR": { "/": " ou " }
  };

  text = text.replace(/\/.*?\//g, ""); // strip anything between slashes

  if (specialReplacements[languageCode]) {
    var replacement = specialReplacements[languageCode]["/"];
    if (replacement) {
      text = text.replace(/\//, replacement);
    }
  }

  if (languageCode === "ES" && text.endsWith("(se)")) {
    text = text.replace("(se)", "se");
  } else {
    text = text.replace(/\(.*?\)/g, "");
  }

  return text;
};

Speaker.prototype.getLanguageAndCountryCode = function(languageCode) {
  var specialCaseCountryCodes = {
    "EN": "US",
    "ES": "MX",
    "JA": "JP",
    "KO": "KR",
    "ZH": "CN"
  };

  var countryCode = specialCaseCountryCodes[languageCode];
  if (!countryCode) countryCode = languageCode;

  return languageCode.toLowerCase() + "-" + countryCode;
};

Speaker.prototype.getSpeechRate = function(languageCode) {
  var specialCaseSpeechRates = {
    "EN": 1.1,
    "ES": 1.0
  };

  return specialCaseSpeechRates[languageCode] || this.defaultRate;
};