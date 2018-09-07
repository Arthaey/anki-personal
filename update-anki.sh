#!/usr/bin/env sh

if [[ -e .env ]]; then
  source .env
fi

ANKI_USER="${ANKI_USER:-$USER}"
ANKI_MEDIA_DIR="$HOME/Documents/Anki2/$ANKI_USER/collection.media"

set -x

# Create combined Javascript file (in correct dependency order!).
echo "var FILE_GENERATION_TIMESTAMP = '$(date)';" > js/_global.js
cat \
  js/EnglishLanguage.js \
  js/FrenchLanguage.js \
  js/Speaker.js \
  js/Card.js \
  js/common.js >> js/_global.js

# Create combined CSS file.
sass --style=expanded --no-cache css/_global.scss css/_global.css

# Make image symlinks, so local testing of CSS will find them.
rm -f css/*.png css/*.jpg
ln images/* css/

# Copy files over to the Anki directory.
if [[ ! "$GENERATE_ONLY" ]]; then
  cp -p css/_global.css $ANKI_MEDIA_DIR/
  cp -p js/_global.js $ANKI_MEDIA_DIR/
  cp -p images/_* $ANKI_MEDIA_DIR/
  cp -p fonts/_* $ANKI_MEDIA_DIR/
  chmod a+r $ANKI_MEDIA_DIR/_*
fi
