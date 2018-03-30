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
    }

  });

  window.dom = (function() {
    var elements = [];

    return {
      createElement: function(id, text) {
        var element = document.createElement("div");
        element.id = id;
        element.innerText = text;
        document.body.insertBefore(element, null);
        elements.push(element);
        return element;
      },

      cleanup: function() {
        for (var i in elements) {
          document.body.removeChild(elements[i]);
          elements.pop(elements[i]);
        }
      }
    };
  })();
});

afterEach(function() {
  dom.cleanup();
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
