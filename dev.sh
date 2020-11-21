#!/bin/bash

shutdown() {
	echo "Start cleaning"
	docker-compose -f docker-compose.dev.yml down
	echo "Finished cleaning"
}

echo "Start building Docker image"
docker-compose --env-file ./config/.env.dev -f docker-compose.dev.yml build
echo "Finished building Docker image"

echo "Starting containers"
trap shutdown INT TERM
docker-compose -f docker-compose.dev.yml up
