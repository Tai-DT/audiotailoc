#!/bin/bash

APP_NAME="backend-audiotailoc"

while IFS= read -r line; do
  if [[ $line =~ ^[^#]*= ]]; then
    key=$(echo "$line" | cut -d'=' -f1)
    value=$(echo "$line" | cut -d'=' -f2-)
    echo "Setting $key"
    heroku config:set --app $APP_NAME $key=$value
  fi
done < .env
