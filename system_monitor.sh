#!/bin/bash

# Define the log file path
LOG_FILE="/var/log/system_usage.log"

# Interval between logging in seconds
INTERVAL=600

# Ensure the log file exists and is writable
if [ ! -w "$LOG_FILE" ]; then
  sudo touch "$LOG_FILE"
  sudo chmod 666 "$LOG_FILE"
fi

# Function to get system usage
log_system_usage() {
  local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
  local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}')
  local ram_usage=$(free -m | awk 'NR==2{printf "%.2f", $3*100/$2 }')
  local disk_usage=$(df -h / | awk 'NR==2 {print $5}')

  echo "$timestamp | CPU: ${cpu_usage}% | RAM: ${ram_usage}% | Disk: ${disk_usage}" >> "$LOG_FILE"
}

# Log system usage at specified intervals
while true; do
  log_system_usage
  sleep "$INTERVAL"
done
