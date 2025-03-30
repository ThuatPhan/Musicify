
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
Before running the services, make sure to set up the environment variables. Create a `.env` file inside the `backend` folder and add the following:

```
DATABASE_URL=postgresql://user:password@postgres:5432/mydb
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379
AUTH0_AUDIENCE=<your-auth0-audience>
AUTH0_DOMAIN=<your-auth0-domain>
AUTH0_ADMIN_PERMISSION=<your-auth0-admin-permission>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
JWT_SECRET=<your-jwt-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
EMAIL_SERVICE=<your-email-service>
EMAIL_USER=<your-email-user>
EMAIL_PASSWORD=<your-email-password>
```

## Running the application
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
