beforeEach(function() {
  jasmine.addMatchers({

    toHaveText: function() {
      return {
        compare: function(actualElement, expectedText) {
          return {
            pass: actualElement.innerText === expectedText
          };
        }
      };
    },

    toBeHidden: function() {
      return {
        compare: function(actualElement) {
          var style = window.getComputedStyle(actualElement);
          return {
            pass: style.display === "none" || actualElement.classList.contains("hidden")
          };
        }
      };
    }


  });

  window.dom = (function() {
    var elements = [];

    return {
      createElement: function(id, text) {
        var element = document.getElementById(id);
        if (!element) {
          element = document.createElement("div");
          elements.push(element);
        }

        element.id = id;
        element.innerText = text;
        document.body.insertBefore(element, null);
        return element;
      },

      cleanup: function() {
        for (var i = 0; i < elements.length; i++) {
          document.body.removeChild(elements[i]);
        }
        elements = [];
      }
    };
  })();
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

function createCardFrontAndBack() {
  var element = createCardFront();
  element.innerHTML += cardBackHTML();
  return element;
}

function cardFrontHTML() {
  return `
    <div class="card-info">
      {{#LeafTags}}<div class="tags">{{LeafTags}}</div>{{/LeafTags}}
      <div class="deck">
        <span id="deck">{{Deck}}</span>: <span class="card-type">{{Card}}</span>
      </div>
      <div class="slash"></div>
    </div>
    <div class="card front">{{Front}}</div>
    <div id="debug" class="extra"></div>
    `;
}

function cardBackHTML() {
  return `
    <!-- -------------------- --> <hr id="answer"> <!-- -------------------- -->
    <div class="card back">{{Back}}</div>
    `;
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
