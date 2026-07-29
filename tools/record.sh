#!/usr/bin/env bash
# Record the autoplay walkthrough end to end.
#
#   tools/record.sh "../ERP Registration Walkthrough - Demo (no captions).mp4"
#
# Serves the site, captures it with record.mjs, then transcodes. The capture
# pass writes near-lossless frames as fast as it can so the browser keeps its
# CPU (see the note in record.mjs); this is where the file is actually squeezed.
#
# Framing: 1280x720 CSS is deliberate, not arbitrary. The layout is a 288px
# sidebar plus a main column capped at max-width:1080px, so the portal is at
# most ~1270px wide -- record it in a wider viewport and the extra is dead
# white margin, which shrinks everything on screen for no gain. At 1280 the
# content fills the frame edge to edge; --dsf 2 buys the resolution back.
set -euo pipefail

OUT="${1:-walkthrough.mp4}"
PORT="${PORT:-8123}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$HERE")"
RAW="$(mktemp -u /tmp/erp-raw-XXXXXX.mp4)"

if ! (cd "$HERE" && node -e "require.resolve('playwright')") 2>/dev/null; then
  echo "playwright is not installed. From $HERE run:" >&2
  echo "    npm install" >&2
  exit 1
fi

python3 -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true; rm -f "$RAW"' EXIT
until curl -sf "http://localhost:$PORT/student-homepage.html" >/dev/null; do sleep 0.3; done

node "$HERE/record.mjs" --out "$RAW" --base "http://localhost:$PORT" "${@:2}"

echo "[rec] transcoding -> $OUT"
ffmpeg -y -hide_banner -loglevel error -i "$RAW" \
  -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart "$OUT"
ls -lh "$OUT"
