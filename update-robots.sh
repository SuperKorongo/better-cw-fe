#!/bin/bash

PUBLIC_DOMAIN=$(grep '^PUBLIC_DOMAIN=' .env.production | cut -d'=' -f2)

# Check if PUBLIC_DOMAIN was found
if [ -z "$PUBLIC_DOMAIN" ]; then
  echo "Error: PUBLIC_DOMAIN not found"
  exit 1
fi

cp static/robots.txt.dist static/robots.txt
sed -i "s|DOMAIN|$PUBLIC_DOMAIN|g" static/robots.txt

# Check if sed command was successful
if [ $? -eq 0 ]; then
  echo "Successfully updated robots.txt"
else
  echo "Error: Failed to update robots.txt"
  exit 1
fi