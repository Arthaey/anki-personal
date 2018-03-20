# anki-personal
Javascript &amp; CSS for my own personal Anki setup.

## Prerequisites

- direnv
- sass

Tested on OS X; probably works fine on Linux too.

## Usage

1. `git clone` this project
2. `cp .env.example .env`
3. edit `.env` with your settings
4. `./update-anki.sh` to generate .css files and copy them to Anki's directory

## Tests

There are Jasmine tests for the more complicated Javascript bits.
Open `spec/SpecRunner.html` in a browser to run them and see their results.
