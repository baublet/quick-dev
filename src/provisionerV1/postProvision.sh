#!/bin/bash

echo "$STRAPYARD_SUBDOMAIN.env.strapyard.dev
reverse_proxy 127.0.0.1:8080" >>/etc/caddy/Caddyfile

sudo systemctl reload caddy
sudo systemctl restart code-server@$USER
