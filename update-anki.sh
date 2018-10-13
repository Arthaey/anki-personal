#!/usr/bin/env sh

if [[ -e .env ]]; then
  source .env
fi

set -e

NOW=$(date "+%Y-%m-%d-%H%M%S")

ANKI_USER="${ANKI_USER:-$USER}"
ANKI_MEDIA_DIR="$HOME/Documents/Anki2/$ANKI_USER/collection.media"

TEMP_DIR="tmp"
GLOBAL_JS_FILE="js/_global.js"
GLOBAL_CSS_FILE="css/_global.css"
GLOBAL_CSS_HEADER_FILE="$TEMP_DIR/_global_header.css"
GLOBAL_CSS_TEMP_FILE="$TEMP_DIR/_global.css"
FORCE_MEDIA_SYNC_SUBSTRING="_force_sync_"
FORCE_MEDIA_SYNC_FILE="$TEMP_DIR/${FORCE_MEDIA_SYNC_SUBSTRING}${NOW}"

LATEST_GIT_SHA=$(git log -1 --format="format:%h")

if [[ -z "$(git status --porcelain)" ]]; then
  GIT_STATUS="CLEAN"
else
  GIT_STATUS="DIRTY"
fi

function echoStatus() {
  echo "- $*..."
}

################################################################################
echo
echo "ANKI_MEDIA_DIR: $ANKI_MEDIA_DIR";
echo
echo "FILE_GENERATION_TIMESTAMP: $NOW";
echo "LATEST_GIT_SHA: $LATEST_GIT_SHA";
echo "GIT_STATUS: $GIT_STATUS";
echo

################################################################################
echoStatus "Creating JS and CSS file generation information"
mkdir -p $TEMP_DIR

cat << EOF_JS > $GLOBAL_JS_FILE
////////////////////////////////////////////////////////////////////////////////
var FILE_GENERATION_TIMESTAMP = "$NOW";
var LATEST_GIT_SHA = "$LATEST_GIT_SHA";
var GIT_STATUS = "$GIT_STATUS";
////////////////////////////////////////////////////////////////////////////////
EOF_JS

cat << EOF_CSS > $GLOBAL_CSS_HEADER_FILE
/*//////////////////////////////////////////////////////////////////////////////
// FILE_GENERATION_TIMESTAMP $NOW
// LATEST_GIT_SHA $LATEST_GIT_SHA
// GIT_STATUS $GIT_STATUS
//////////////////////////////////////////////////////////////////////////////*/
EOF_CSS

################################################################################
echoStatus "Creating combined Javascript file (in correct dependency order!)"

cat \
  js/polyfills.js \
  js/EnglishLanguage.js \
  js/FrenchLanguage.js \
  js/GermanLanguage.js \
  js/Speaker.js \
  js/Card.js \
  js/common.js >> $GLOBAL_JS_FILE

################################################################################
echoStatus "Creating combined CSS file"
sass --style=expanded --no-cache css/_global.scss $GLOBAL_CSS_FILE
cat $GLOBAL_CSS_HEADER_FILE $GLOBAL_CSS_FILE > $GLOBAL_CSS_TEMP_FILE
cp $GLOBAL_CSS_TEMP_FILE $GLOBAL_CSS_FILE

################################################################################
echoStatus "Linting Javascript"
eslint .

################################################################################
echoStatus "Making image symlinks, so local testing of CSS will find them"
rm -f css/*.png css/*.jpg
pushd css > /dev/null
ln -s ../images/* ./
popd > /dev/null

################################################################################
echoStatus "Creating unique, new file to force Anki to sync media"
rm $ANKI_MEDIA_DIR/${FORCE_MEDIA_SYNC_SUBSTRING}*
echo $NOW > $FORCE_MEDIA_SYNC_FILE

################################################################################
echoStatus "Coping files over to the Anki directory"
if [[ ! "$GENERATE_ONLY" ]]; then
  cp -p $GLOBAL_CSS_FILE $ANKI_MEDIA_DIR/
  cp -p $GLOBAL_JS_FILE $ANKI_MEDIA_DIR/
  cp -p images/_* $ANKI_MEDIA_DIR/
  cp -p fonts/_* $ANKI_MEDIA_DIR/
  cp -p $FORCE_MEDIA_SYNC_FILE $ANKI_MEDIA_DIR/
  chmod a+r $ANKI_MEDIA_DIR/_*
fi

################################################################################
rm -rf $TEMP_DIR
echo
echo "Done."
