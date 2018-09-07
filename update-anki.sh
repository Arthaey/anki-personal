#!/usr/bin/env sh

if [[ -e .env ]]; then
  source .env
fi

ANKI_USER="${ANKI_USER:-$USER}"
ANKI_MEDIA_DIR="$HOME/Documents/Anki2/$ANKI_USER/collection.media"

GLOBAL_JS="js/_global.js"
GLOBAL_CSS="css/_global.css"

set -x

# Set generated global variables.
echo "///////////////////////////////////////////////////////////////" > $GLOBAL_JS
echo "var FILE_GENERATION_TIMESTAMP = '$(date)';" >> $GLOBAL_JS
echo "var LATEST_GIT_SHA = '$(git log -1 --format="format:%h")'" >> $GLOBAL_JS
if [[ -z "$(git status --porcelain)" ]]; then
  echo "var GIT_STATUS = 'CLEAN';" >> $GLOBAL_JS
else
  echo "var GIT_STATUS = 'DIRTY';" >> $GLOBAL_JS
fi
echo "///////////////////////////////////////////////////////////////" >> $GLOBAL_JS
echo >> $GLOBAL_JS

# Create combined Javascript file (in correct dependency order!).
cat \
  js/EnglishLanguage.js \
  js/FrenchLanguage.js \
  js/Speaker.js \
  js/Card.js \
  js/common.js >> $GLOBAL_JS

# Create combined CSS file.
sass --style=expanded --no-cache css/_global.scss $GLOBAL_CSS

# Make image symlinks, so local testing of CSS will find them.
rm -f css/*.png css/*.jpg
ln images/* css/

# Copy files over to the Anki directory.
if [[ ! "$GENERATE_ONLY" ]]; then
  cp -p $GLOBAL_CSS $ANKI_MEDIA_DIR/
  cp -p $GLOBAL_JS $ANKI_MEDIA_DIR/
  cp -p images/_* $ANKI_MEDIA_DIR/
  cp -p fonts/_* $ANKI_MEDIA_DIR/
  chmod a+r $ANKI_MEDIA_DIR/_*
fi
