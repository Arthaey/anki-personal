/* global setup Card dom DOMCustomMatchers */

window.dom = (function() {
  var elements = [];

  return {
    createElement: function(id, text, options) {
      if (!options) options = {};

      var element = document.getElementById(id);
      if (!element) {
        element = document.createElement("div");
        elements.push(element);
      }

      element.id = id;
      element.textContent = text;

      if (options.html) {
        element.innerHTML = options.html;
      }

      document.documentElement.insertBefore(element, null);
      return element;
    },

    cleanup: function() {
      for (var i = 0; i < elements.length; i++) {
        elements[i].remove();
      }
      elements = [];
    },
  };
})();

beforeAll(function() {
  jasmine.addMatchers(DOMCustomMatchers); // jasmine-devrafalko

  jasmine.addMatchers({

    toHaveText: function() {
      return {
        compare: function(actualElement, expectedText) {
          return {
            pass: actualElement.textContent === expectedText,
          };
        },
      };
    },

    toBeHidden: function() {
      return {
        compare: function(actualElement) {
          var style = window.getComputedStyle(actualElement);
          return {
            pass: style.display === "none" || actualElement.classList.contains("hidden"),
          };
        },
      };
    },

  });

});

afterEach(function() {
  var skipCleanup = getQueryParam("skipCleanup");
  if (!skipCleanup) {
    dom.cleanup();
  }
});

function createCard(params) {
  if (!params) params = {};
  if (!params.fields) params.fields = {};
  if (!params.deck) params.deck = "MyDeck";
  if (!params.note) params.note = "MyNote";
  if (!params.card) params.card = "MyCard";
  if (!params.tags) params.tags = "MyTags";
  if (!params.front) params.front = "question";
  if (!params.back) params.back = "answer";
  if (!params.cardId) params.cardId = "";
  if (typeof params.return === "undefined") params.return = "card";

  var frontHtml = cardFrontHTML();
  var backHtml = params.includeBack ? cardBackHTML() : "";

  var fullHtml;
  if (params.domElement) {
    fullHtml = params.domElement.outerHTML;
  } else {
    fullHtml = `
      <html class="webkit safari mac js">
        <body class="card" id="${params.cardId}">
          <div id="qa">
            ${frontHtml}
            ${backHtml}
          </div>
        </body>
      </html>
    `;
  }

  fullHtml = replaceAnkiVariable(fullHtml, "Deck", params.deck);
  fullHtml = replaceAnkiVariable(fullHtml, "Note", params.note);
  fullHtml = replaceAnkiVariable(fullHtml, "Card", params.card);
  fullHtml = replaceAnkiVariable(fullHtml, "LeafTags", params.tags);
  fullHtml = replaceAnkiVariable(fullHtml, "Front", params.front);
  fullHtml = replaceAnkiVariable(fullHtml, "Back", params.back);

  var el = dom.createElement("testId", "default content", { html: fullHtml });

  if (params.frontId) {
    var frontEl = el.querySelector(".card.front");
    frontEl.id = params.frontId;
  }
  if (params.backId && params.includeBack) {
    var backEl = el.querySelector(".card.back");
    backEl.id = params.backId;
  }

  var card;
  if (params.return !== "card") {
    setup(el, params.deck, params.note, params.card, params.tags);
  } else {
    card = new Card(el, params.deck, params.note, params.card, params.tags);
  }

  switch (params.return.toLowerCase()) {
    case "card":
      return card;
    case "html":
      return el.outerHTML;
    default:
      return el;
  }
}

/* eslint-disable-next-line no-unused-vars */
function createCardAsHtml(params) {
  if (!params) params = {};
  params.return = "html";
  return createCard(params);
}

/* eslint-disable-next-line no-unused-vars */
function createCardAsElement(params) {
  if (!params) params = {};
  params.return = "element";
  return createCard(params);
}

function createCardFront() {
  var element = dom.createElement("container");
  element.innerHTML = cardFrontHTML();
  return element;
}

/* eslint-disable-next-line no-unused-vars */
function createCardFrontAndBack() {
  var element = createCardFront();
  element.innerHTML += cardBackHTML();
  return element;
}

function cardFrontHTML() {
  return '<div class="card front" id="tts">{{Front}}</div>';
}

function cardBackHTML() {
  return `
    <!-- -------------------- --> <hr id="answer"> <!-- -------------------- -->
    <div class="card back">{{Back}}</div>
    `;
}

/* eslint-disable-next-line no-unused-vars */
function replaceAnkiVariable(template, name, value) {
  return template.replace(new RegExp("{{" + name + "}}"), value);
}

function getQueryParam(key) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === key) {
      if (pair.length === 1) pair.push(true);
      return pair[1];
    }
  }

  return null;
}
