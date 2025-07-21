# Express Demo for Hostim.dev

This is a simple demo app to show what the Hostim.dev container hosting platform can do. It's a basic user management system with a few key features:

## What it does

- Create users and list them
- Upload avatar images
- Use PostgreSQL for the database
- Use Redis for caching
- Runs in Docker containers

## Tech used

- Node.js with Express
- Sequelize for ORM
- PostgreSQL
- Redis
- Docker + Docker Compose
- Jade for templates

## How it’s organized

- `config/database.js` – sets up the PostgreSQL connection
- `config/redis.js` – connects to Redis
- `models/User.js` – defines the User model
- `views/` – contains the Jade templates
- `docker-compose.yml` – runs everything in containers
- `Dockerfile` – builds the Node.js app container

## How to run it

To run the app locally:

```bash
docker-compose up --build
```

Docker Compose sets up three services:

- The web app (Node.js)
- PostgreSQL
- Redis

This app is also set up for easy deployment on Hostim.dev. It shows how to spin up a full stack app with a database and cache inside containers.
For detailed steps on hosting this on Hostim.dev, [check out the Hostim.dev deployment guide](https://hostim.dev/docs/guides/frameworks/express).
