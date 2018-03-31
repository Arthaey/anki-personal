function Speaker() {
  this.volume = 0.5; // 0 to 1
  this.rate = 0.9; // 0.1 to 9
  this.pitch = 1; // 0 to 2, 1=normal
};

Speaker.prototype.canSpeak = function() {
  return typeof SpeechSynthesisUtterance !== "undefined" && !!SpeechSynthesisUtterance;
};

Speaker.prototype.speak = function(text, languageCode) {
  if (!this.canSpeak()) return;
  var utterance = new SpeechSynthesisUtterance();
  utterance.text = this.normalizeText(text);
  utterance.lang = this.getLanguageAndCountryCode(languageCode);
  utterance.volume = this.volume;
  utterance.rate = this.rate;
  utterance.pitch = this.pitch;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
};

Speaker.prototype.normalizeText = function(text) {
  text = text.replace(/\/.*?\//g, "");
  text = text.replace(/\(.*?\)/g, "");
  return text;
};

Speaker.prototype.getLanguageAndCountryCode = function(languageCode) {
  var specialCaseCountryCodes = {
    "en": "US",
    "es": "MX",
    "ja": "JP",
    "ko": "KR",
    "zh": "CN",
  };

  languageCode = languageCode.toLowerCase();
  var countryCode = specialCaseCountryCodes[languageCode];
  if (!countryCode) countryCode = languageCode.toUpperCase();

  return languageCode + "-" + countryCode;
};
