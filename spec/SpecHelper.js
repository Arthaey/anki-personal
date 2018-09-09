/* global dom DOMCustomMatchers */

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
      element.innerText = text;

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
            pass: actualElement.innerText === expectedText,
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
