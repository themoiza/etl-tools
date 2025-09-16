#!/bin/bash

ports=(8501 8502 8503 8504 8505 8506 8507 8508 8509 8510)
server_script="server.php"
pids=()

first=true
for port in "${ports[@]}"; do
    echo "Starting server on port $port..."
    if $first; then
        php "$server_script" "$port" true &
        first=false
    else
        php "$server_script" "$port" &
    fi
    pids+=($!)
done

cleanup() {
	echo "Shutting down..."
	kill "${pids[@]}" 2>/dev/null
	exit 0
}

trap cleanup SIGINT

echo "All servers have been started!"
echo "Press CTRL+C to stop."

wait "${pids[@]}"