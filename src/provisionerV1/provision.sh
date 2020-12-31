#!/bin/bash

# Hit our function to tell StrapYard that our environment is up
IP_ADDRESS=$(curl http://checkip.amazonaws.com)
curl --header "Content-Type: application/json" \
  --header "Authorization: $STRAPYARD_ENVIRONMENT_SECRET" \
  --request POST \
  --data "{\"subdomain\":\"$STRAPYARD_SUBDOMAIN\", \"ipv4\": \"$IP_ADDRESS\"}" \
  "$STRAPYARD_PUBLIC_URL/.netlify/functions/environmentProvisioning"

sudo apt-get update

curl -sL https://deb.nodesource.com/setup_13.x | echo -
curl -sL http://localhost:8888/.netlify/functions/getProvisioner?subdomain=dull-bulldog-39&secret=01ETTPFATPTP0DC7YKHGM2ZPZK | echo -