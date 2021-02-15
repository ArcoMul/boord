#!/bin/bash

echo "Start building Docker image"
docker build -f Dockerfile.prod -t lumocra/boord:latest .
echo "Finished building Docker image"

echo "Start pushing Docker image"
docker push lumocra/boord:latest
echo "Finished pushing Docker image"