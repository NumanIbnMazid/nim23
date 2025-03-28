# Use Ubuntu as the base image
FROM ubuntu:22.04

# Set environment variables
ENV PYTHONUNBUFFERED=1
# Set the environment variable to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Dhaka

# Install required system dependencies (including zlib-dev)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    curl \
    wget \
    musl-dev \
    libssl-dev \
    libffi-dev \
    libjpeg-dev \
    libpq-dev \
    zlib1g-dev \
    netcat \
    tzdata \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python 3.9.16 from source (using --no-check-certificate for wget)
RUN wget --no-check-certificate https://www.python.org/ftp/python/3.9.16/Python-3.9.16.tgz && \
    tar xzf Python-3.9.16.tgz && \
    cd Python-3.9.16 && \
    ./configure --without-tests --enable-optimizations --enable-shared && \
    make -j$(nproc) && \
    make altinstall && \
    ldconfig /usr/local/lib && \
    cd .. && rm -f Python-3.9.16.tgz && rm -rf Python-3.9.16 && \
    ln -s /usr/local/bin/python3.9 /usr/local/bin/python

# Set the Python executable path explicitly
ENV PYTHON="/usr/local/bin/python3.9" 

# Upgrade pip for Python 3.9
RUN $PYTHON -m ensurepip && \
    $PYTHON -m pip install --no-cache --upgrade pip

# Create and set the working directory
RUN mkdir /app
WORKDIR /app

# Copy the requirements file and install Python dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN $PYTHON -m pip install -r requirements.txt

# Add the entrypoint script and make it executable
COPY backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Copy the rest of the application files
COPY backend /app

# Set the entrypoint
ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]