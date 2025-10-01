#!/bin/bash
# Remove Vercel ALIAS and A 76.76.21.21 to leave only Squarespace IP set
set -e
DOMAIN=audiotailoc.com
SCOPE=kadevs-projects

echo "Fetching records..."
JSON=$(vercel dns ls $DOMAIN --scope=$SCOPE --json)

# Remove ALIAS records
ALIAS_IDS=$(echo "$JSON" | jq -r '.records[] | select(.type == "ALIAS") | .id')
for ID in $ALIAS_IDS; do
  if [ -n "$ID" ] && [ "$ID" != "null" ]; then
    echo "Removing ALIAS ($ID)"
    vercel dns rm $ID --scope=$SCOPE -y || true
  fi
done

# Remove 76.76.21.21 root A if exists
ID=$(echo "$JSON" | jq -r '.records[] | select(.value == "76.76.21.21") | .id')
if [ -n "$ID" ] && [ "$ID" != "null" ]; then
  echo "Removing legacy Vercel A 76.76.21.21 ($ID)"
  vercel dns rm $ID --scope=$SCOPE -y || true
fi

echo "Done. Remaining records:"
vercel dns ls $DOMAIN --scope=$SCOPE