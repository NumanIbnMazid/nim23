# Use Ubuntu as the base image
FROM ubuntu:25.04

# Install required system dependencies
RUN apt update && \
    apt install -y --no-install-recommends \
    build-essential \
    gcc \
    curl \
    gnupg2 \
    ca-certificates \
    apt-transport-https \
    && apt clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.2.0
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash -
RUN apt install -y nodejs

# Install yarn
RUN npm install -g yarn

WORKDIR /app

# Copy the .env file to /app
COPY frontend/.env /app/.env

# Copy package files
COPY frontend/package*.json /app
COPY frontend/yarn.lock /app

# Copy the Prisma schema
COPY frontend/prisma /app/prisma

# Install dependencies
RUN yarn install

# Add the entrypoint script and make it executable
COPY frontend/entrypoint.sh /app/entrypoint.sh
COPY --chmod=755 frontend/entrypoint.sh /app/entrypoint.sh

# Copy the rest of the application files
COPY frontend /app

# Set the entrypoint
ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]
