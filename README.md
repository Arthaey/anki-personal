# anki-personal
Javascript &amp; CSS for my own personal Anki setup.

Why so much Javascript, instead of Python add-ons? Because I want the same
features available on desktop and iOS, but the latter doesn't support add-ons.

## Prerequisites

- direnv
- sass

Tested on OS X; probably works fine on Linux too.

## Usage

1. `git clone` this project
2. `cp .env.example .env`
3. edit `.env` with your settings
4. `./update-anki.sh` to generate files and copy them to Anki's directory

## Tests

There are Jasmine tests for the more complicated Javascript bits.
Open `spec/SpecRunner.html` in a browser to run them and see their results.

# Flag Images

Downloaded from http://www.famfamfam.com/lab/icons/flags/
