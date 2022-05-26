# commands

## create docker network
  docker network create postgres-network

# start postgres
  docker run -d --name psql -e POSTGRES_PASSWORD=postgres -p5436:5432 --net postgres-network postgres
