var DEBUG = (typeof DEBUG === 'undefined') ? false : DEBUG;

function setup(dom, deckName, noteType, cardType, tags) {
  var card = new Card(dom, deckName, noteType, cardType, tags);
}

function appendDebug(msg) {
  if (!DEBUG) return;
  if (!msg) msg = '<undefined>';

  var debug = document.getElementById("debug");
  if (debug) {
    debug.innerHTML += htmlEscape(msg) + "<br/>";
  }
}

function appendDebugSourceCode() {
  if (!DEBUG) return;

  var element = document.querySelector(".card.front");
  var code = document.createElement("div");
  code.className = "code";

  var debug = document.getElementById("debug");
  if (debug) {
    debug.innerHTML += new XMLSerializer().serializeToString(element);
    debug.innerHTML += "<br/>";
  }
}

function htmlEscape(str) {
  if (!str) return '<null>';

  // Quick & dirty.
  // http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
  return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

appendDebug("DEBUGGING:");
appendDebug("DECK: " + (typeof DECK === "undefined" ? "undefined" : DECK));
appendDebug("NOTE: " + (typeof NOTE === "undefined" ? "undefined" : NOTE));
appendDebug("CARD: " + (typeof CARD === "undefined" ? "undefined" : CARD));
appendDebug("TAGS: " + (typeof TAGS === "undefined" ? "undefined" : TAGS));

//document.addEventListener('DOMContentLoaded', setup); // doesn't work on phone
if (document && document.documentElement &&
    typeof DECK !== 'undefined' &&
    typeof NOTE !== 'undefined' &&
    typeof CARD !== 'undefined' &&
    typeof TAGS !== 'undefined')
{
  setup(document.documentElement, DECK, NOTE, CARD, TAGS);
}
