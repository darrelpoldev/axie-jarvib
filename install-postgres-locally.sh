#!/bin/bash

# mkdir postgres
# cd postgres

printf "creating volume for the database \n"
docker volume create --driver local --name=pgvolume
printf "creating volume for the pgadmin\n"
docker volume create --driver local --name=pga4volume

# creating network so they can talk to eachother
docker network create --driver bridge pgnetwork

cat << EOF > pg-env.list
PG_MODE=primary
POSTGRES_PRIMARY_USER=postgres
POSTGRES_PRIMARY_PASSWORD=postgres
POSTGRES_DATABASE=testdb
POSTGRES_USER=default
POSTGRES_PASSWORD=default
POSTGRES_ROOT_PASSWORD=postgres
EOF

cat << EOF > pgadmin-env.list
PGADMIN_SETUP_EMAIL=default@jarvib.com
PGADMIN_SETUP_PASSWORD=default
PGADMIN_DEFAULT_EMAIL=default@jarvib.com
PGADMIN_DEFAULT_PASSWORD=default
PGADMIN_LISTEN_PORT=5050
EOF

printf "created environment variables files\n"

printf "stopping the postgres container...\n"
docker stop postgres
printf "removing the postgres container...\n"
docker rm postgres

docker run --publish 5432:5432 \
  --volume=pgvolume:/pgdata \
  --env-file=pg-env.list \
  --name="postgres" \
  --hostname="postgres" \
  --network="pgnetwork" \
  --detach \
postgres:12.2

printf "stopping the pgadmin4 container...\n"
docker stop pgadmin4
printf "removing the pgadmin4 container...\n"
docker rm pgadmin4
docker run --publish 5050:5050 \
  --volume=pga4volume:/var/lib/pgadmin \
  --env-file=pgadmin-env.list \
  --name="pgadmin4" \
  --hostname="pgadmin4" \
  --network="pgnetwork" \
  --detach \
dpage/pgadmin4

printf "pgadmin should be listening on http://localhost:5050\n"

# Go to http://localhost:5050/
# Log into pgAdmin 4 with
# Email: youremail@yourdomain.com
# Password: yoursecurepassword
# Add a server using:
# Hostname: postgres
# Username: yourusername
# Password: yourpassword
