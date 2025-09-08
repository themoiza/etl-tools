#!/bin/bash

ports=(8501 8502 8503 8504 8505 8506 8507 8508 8509 8510)
server_script="server.php"
pids=()

first=true
for port in "${ports[@]}"; do
    echo "Iniciando servidor na porta $port..."
    if $first; then
        php "$server_script" "$port" true &  # só o primeiro abre navegador
        first=false
    else
        php "$server_script" "$port" &       # os outros sem navegador
    fi
    pids+=($!)
done

cleanup() {
	echo
	echo "Encerrando..."
	kill "${pids[@]}" 2>/dev/null
	exit 0
}

trap cleanup SIGINT

echo "Todos os servidores foram iniciados!"
echo "Pressione CTRL+C para encerrar."

wait "${pids[@]}"