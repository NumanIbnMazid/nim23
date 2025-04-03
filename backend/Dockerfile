# Use Ubuntu as the base image
FROM ubuntu:22.04

# Set environment variables
ENV PYTHONUNBUFFERED=1
# Set the environment variable to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Dhaka
ENV PYTHON_VERSION=3.12.2

# Install required system dependencies (including zlib-dev)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    curl \
    wget \
    net-tools \
    musl-dev \
    libssl-dev \
    libffi-dev \
    libjpeg-dev \
    libpq-dev \
    zlib1g-dev \
    netcat \
    tzdata \
    ffmpeg \
    supervisor \
    ca-certificates \
    && update-ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python ${PYTHON_VERSION} from source (using --no-check-certificate for wget)
RUN wget --no-check-certificate https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tgz && \
    tar xzf Python-${PYTHON_VERSION}.tgz && \
    cd Python-${PYTHON_VERSION} && \
    ./configure --without-tests --enable-optimizations --enable-shared && \
    make -j$(nproc) && \
    make altinstall && \
    ldconfig /usr/local/lib && \
    cd .. && rm -rf Python-${PYTHON_VERSION}.tgz Python-${PYTHON_VERSION} && \
    ln -s /usr/local/bin/python3.12 /usr/local/bin/python

# Set the Python executable path explicitly
ENV PYTHON="/usr/local/bin/python3.12" 

# Upgrade pip for Python
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

# Set the entrypoint
ENTRYPOINT [ "sh", "-c", "/app/entrypoint.sh" ]
