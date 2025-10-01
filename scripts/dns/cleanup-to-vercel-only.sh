#!/bin/bash
# Remove Squarespace A records and leave only Vercel ALIAS / 76.76.21.21
set -e
DOMAIN=audiotailoc.com
SCOPE=kadevs-projects

echo "Fetching records..."
JSON=$(vercel dns ls $DOMAIN --scope=$SCOPE --json)

# Parse IDs for Squarespace IPs
for IP in 198.185.159.144 198.185.159.145 198.49.23.144 198.49.23.145; do
  ID=$(echo "$JSON" | jq -r ".records[] | select(.value == \"$IP\") | .id")
  if [ -n "$ID" ] && [ "$ID" != "null" ]; then
    echo "Removing A $IP ($ID)"
    vercel dns rm $ID --scope=$SCOPE -y || true
  else
    echo "No record found for $IP"
  fi
done

echo "Done. Remaining records:"
vercel dns ls $DOMAIN --scope=$SCOPE