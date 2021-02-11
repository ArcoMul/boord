export HOST="root@161.35.90.32"
export LABEL="boord"

if docker build -t $LABEL -f ./Dockerfile.prod .;
then

    # Export docker image
    mkdir -p .docker/export
    echo "Saving build image as archive... (could take several minutes)"
    docker save "$LABEL" | gzip > .docker/export/"$LABEL.tar.gz" && \
    echo -e "Image is $(du -h .docker/export/$LABEL.tar.gz | cut -f1) big"

    # Upload docker image and load it
    ssh $HOST "mkdir -p /root/.docker/export" && \
    scp ".docker/export/$LABEL.tar.gz" "$HOST:/root/.docker/export/$LABEL.tar.gz" && \
    ssh $HOST "gzip -cvd /root/.docker/export/$LABEL.tar.gz | docker load" && \

    # Upload docker compose and restart services
    ssh $HOST "mkdir -p /opt/web/$LABEL" && \
    scp docker-compose.prod.yml $HOST:/opt/web/$LABEL/docker-compose.prod.yml && \
    ssh $HOST "docker-compose -f /opt/web/$LABEL/docker-compose.prod.yml down; docker-compose -f /opt/web/$LABEL/docker-compose.prod.yml up -d" && \

    echo -e "Done deploying" || echo -e "Something went wrong"

else
    echo -e "Something went wrong"
fi;