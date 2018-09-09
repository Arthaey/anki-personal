module.exports = {
	"env": { "browser": true },
	"extends": "eslint:recommended",
	"parserOptions": { "ecmaVersion": 5 },

	"rules": {

    "comma-dangle": [ "error", "never" ],

		"indent":          [ "error", 2 ],

		"linebreak-style": [ "error", "unix" ],

    "no-alert":        [ "error" ],

    "no-unused-vars":  [ "error", {
      "vars": "all",
      "args": "all",
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_",
    }],

		"quotes":          [ "error", "double", {
      "avoidEscape": true,
		}],

		"semi":            [ "error", "always" ],
	},

  "overrides": [
    {
      "files": [
        "spec/*.js",
      ],
      "env": { "browser": true, "jasmine": true },
      "parserOptions": { "ecmaVersion": 6 },

      "rules": {
        "comma-dangle": [ "error", "always-multiline" ],
      }
    },
  ],
};
