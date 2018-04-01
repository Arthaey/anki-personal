var EnglishLanguage = {};

EnglishLanguage.conjugate = function(infinitive, person, tense) {
  if (!infinitive) return;
  var verbStem = infinitive.replace(/^to /, "");
  var suffix = (person === "3sg") ? "s" : "";
  var conjugated = verbStem + suffix;
  return conjugated;
};
