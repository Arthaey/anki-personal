var FrenchLanguage = {};

FrenchLanguage.conjugations = {
  "Pres": {
    "er": {
      "1sg": "e",    "1pl": "ons",
      "2sg": "es",   "2pl": "ez",
      "3sg": "e",    "3pl": "ent"
    },
    "ir": {
      "1sg": "is",   "1pl": "issons",
      "2sg": "is",   "2pl": "issez",
      "3sg": "it",   "3pl": "issent"
    },
    "re": {
      "1sg": "s",    "1pl": "ons",
      "2sg": "s",    "2pl": "ez",
      "3sg": "",     "3pl": "ent"
    }
  }
};

FrenchLanguage.conjugate = function(infinitive, person, tense) {
  if (!infinitive || !person || !tense) return null;
  if (infinitive.length < 2) return null;

  var verbStem = infinitive.substr(0, infinitive.length - 2);
  var verbEnding = infinitive.substr(-2, 2);

  if (!verbEnding) return null;
  if (!FrenchLanguage.conjugations[tense]) return null;
  if (!FrenchLanguage.conjugations[tense][verbEnding]) return null;
  if (!FrenchLanguage.conjugations[tense][verbEnding].hasOwnProperty(person)) return null;

  var suffix = FrenchLanguage.conjugations[tense][verbEnding][person];
  var conjugated = verbStem + suffix;
  return conjugated;
};
