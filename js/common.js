/* global DEBUG FILE_GENERATION_TIMESTAMP LATEST_GIT_SHA GIT_STATUS Card ANKI_DATA DECK NOTE CARD TAGS */

var DEBUG = (typeof DEBUG === "undefined") ? false : DEBUG;

function setup(dom, ANKI_DATA) {
  try {
    var params = ANKI_DATA;
    params.dom = dom;
    var card = new Card(params);
    appendFileGenerationInfo(card);
  } catch (error) {
    alert(error); /* eslint-disable-line no-alert */
  }
}

function appendFileGenerationInfo(card) {
  var timestamp = "unknown";
  var gitSha    = "unknown";
  var gitStatus = "status unknown";

  if (typeof FILE_GENERATION_TIMESTAMP !== "undefined" && !!FILE_GENERATION_TIMESTAMP) {
    timestamp = FILE_GENERATION_TIMESTAMP;
  }
  if (typeof LATEST_GIT_SHA !== "undefined" && !!LATEST_GIT_SHA) {
    gitSha = LATEST_GIT_SHA;
  }
  if (typeof GIT_STATUS !== "undefined" && !!GIT_STATUS) {
    gitStatus = GIT_STATUS;
  }

  var id = "file-generation-info";
  var infoEl = document.getElementById(id);
  if (!infoEl) {
    infoEl = document.createElement("div");
    infoEl.id = id;
  }

  infoEl.innerHTML = "Updated: ";
  infoEl.innerHTML += timestamp;
  infoEl.innerHTML += " @ git sha " + gitSha;
  infoEl.innerHTML += " (" + gitStatus + ").";

  card.dom.appendChild(infoEl);
}

function appendMessage(msg) {
  if (!msg) msg = "<no-value>";
  var debug = document.getElementById("debug");
  if (debug) {
    debug.innerHTML += htmlEscape(msg) + "<br/>";
  }
}

function appendDebug(msg) {
  if (!DEBUG) return;
  appendMessage(msg);
}

/* eslint-disable-next-line no-unused-vars */
function appendDebugSourceCode() {
  var element = document.querySelector(".card.front");
  var source = new XMLSerializer().serializeToString(element) + "<br/>";
  appendDebug(source);
}

function htmlEscape(str) {
  if (!str) return "<no-value>";

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
appendDebug("ANKI_DATA: " + (typeof ANKI_DATA === "undefined" ? "undefined" : ANKI_DATA));
appendDebug("DECK: " + (typeof DECK === "undefined" ? "undefined" : DECK));
appendDebug("NOTE: " + (typeof NOTE === "undefined" ? "undefined" : NOTE));
appendDebug("CARD: " + (typeof CARD === "undefined" ? "undefined" : CARD));
appendDebug("TAGS: " + (typeof TAGS === "undefined" ? "undefined" : TAGS));

//document.addEventListener('DOMContentLoaded', setup); // doesn't work on phone
if (document && document.documentElement && typeof ANKI_DATA !== "undefined") {
  setup(document.documentElement, ANKI_DATA);
}