module.exports = {
  "env": { "browser": true },
  "extends": "eslint:recommended",
  "parserOptions": { "ecmaVersion": 5 },

  "rules": {

    "array-bracket-spacing": ["error", "always", {
      "singleValue": false,
      "objectsInArrays": false,
    }],

    "comma-dangle": ["error", "never"],

    "indent": ["error", 2, { "SwitchCase": 1 }],

    "linebreak-style": ["error", "unix"],

    "no-alert": ["error"],

    "no-unused-vars": ["error", {
      "vars": "all",
      "args": "all",
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_",
    }],

    "object-curly-spacing": ["error", "always"],

    "quotes": ["error", "double", {
      "avoidEscape": true,
    }],

    "semi": ["error", "always"],

    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "always"
    }],

  },

  "overrides": [
    {
      "files": [
        "spec/*.js",
      ],
      "env": { "browser": true, "jasmine": true },
      "parserOptions": { "ecmaVersion": 6 },

      "rules": {
        "comma-dangle": ["error", "always-multiline"],
      }
    },
  ],
};
