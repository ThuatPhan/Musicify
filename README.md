# Musicify Setup Guide

## Prerequisites
Make sure you have the following installed on your machine:
- Docker
- Docker Compose

## Clone the repository
```
git clone <repository-url>
cd musicify
```

## Environment Variables
All environment variables are configured directly in the `docker-compose.yml` file under the `backend` service.

Open the `docker-compose.yml` file and fill in the following environment variables for the backend service:

```
services:
  backend:
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/mydb
      REDIS_URL: redis://redis:6379
      REDIS_HOST: redis
      REDIS_PORT: 6379
      AUTH0_AUDIENCE: <your-auth0-audience>
      AUTH0_DOMAIN: <your-auth0-domain>
      AUTH0_ADMIN_PERMISSION: <your-auth0-admin-permission>
      CLOUDINARY_CLOUD_NAME: <your-cloudinary-cloud-name>
      CLOUDINARY_API_KEY: <your-cloudinary-api-key>
      CLOUDINARY_API_SECRET: <your-cloudinary-api-secret>
```


Start the services using Docker Compose:
```
docker-compose up --build
```

## Accessing the application
- Frontend: [http://localhost:5000](http://localhost:5000)
- Backend: [http://localhost:3000](http://localhost:3000)

## Database Access
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Stopping the services
To stop the running containers:
```
docker-compose down
```

## Troubleshooting
If you encounter any issues, check the container logs:
```
docker-compose logs -f
```

