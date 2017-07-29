#!/usr/bin/env sh

if [[ -e .env ]]; then
  source .env
fi

ANKI_USER="${ANKI_USER:-$USER}"
ANKI_MEDIA_DIR="$HOME/Documents/Anki2/$ANKI_USER/collection.media"

set -x

sass --style=expanded --no-cache css/_global.scss css/_global.css
cp -p css/_global.css $ANKI_MEDIA_DIR/
cp -p js/_global.js $ANKI_MEDIA_DIR/
cp -p images/_* $ANKI_MEDIA_DIR/
cp -p fonts/_* $ANKI_MEDIA_DIR/
