# Use Ubuntu as the base image
FROM ubuntu:22.04

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    curl \
    gnupg2 \
    ca-certificates \
    apt-transport-https \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20.2.0
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

# Install webpack
RUN yarn global add webpack

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json /app
COPY frontend/yarn.lock /app

# Copy the Prisma schema
COPY frontend/prisma /app/prisma

# Install dependencies
RUN yarn install

# Add the entrypoint script and make it executable
COPY frontend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Copy the rest of the application files
COPY frontend /app

# Set the entrypoint
ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]
