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
