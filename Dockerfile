# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

ENV NODE_OPTIONS=--openssl-legacy-provider

COPY . ./

# The build script will use the .env file at the root
RUN npm run build

# Stage 2: Serve the application using a static file server
FROM node:18-alpine

WORKDIR /app

# Install serve to run the web server
RUN npm install -g serve

# Copy the build output from the build stage
COPY --from=build /app/build ./build

# Expose the port serve will run on
EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "build"]
