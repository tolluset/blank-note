# How to start

```bash
# create a network
docker network create app-network

# start the database and server containers
docker-compose -f docker-compose.db.yml up -d
docker-compose -f docker-compose.server.yml up -d

# if in top directory
docker-compose -f packages/server/docker-compose.db.yml up -d
docker-compose -f packages/server/docker-compose.server.yml up -d
```
