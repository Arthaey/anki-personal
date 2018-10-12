var GermanLanguage = {};

GermanLanguage.pluralize = function(singularNounPlusSuffix) {
  if (!singularNounPlusSuffix) return "";

  var regex = /^(der|die|das) (\w+), –(.*)$/;
  var match = singularNounPlusSuffix.match(regex);
  if (!match) return singularNounPlusSuffix;

  var article = match[1];
  var singular = match[2];
  var suffix = match[3];

  var singularNP = article + " " + singular;

  var pluralNP = "die ";
  if (suffix.startsWith("¨")) {
    pluralNP += singular.replace(/[aeiou]/i, "$&̈") + suffix.substring(1);
  } else {
    pluralNP += singular + suffix; } return singularNP + ", " + pluralNP;
};