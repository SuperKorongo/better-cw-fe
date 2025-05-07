#!/bin/bash

# Start cron in the background
cron

# Start Nginx in the foreground (Nginx should not daemonize)
exec nginx -g 'daemon off;'