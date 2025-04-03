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

# Copy the rest of the application files
COPY backend /app

# Install Node.js via 'n'
RUN curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s lts && \
    npm install -g npm@latest && \
    npm install -g yarn

# Copy and set up bgutil-ytdlp-pot-provider
COPY backend/bgutil-ytdlp-pot-provider /app/bgutil-ytdlp-pot-provider
RUN cd /app/bgutil-ytdlp-pot-provider/server/ && yarn install --frozen-lockfile

# Set up Supervisor
COPY backend/supervisord.conf /etc/supervisor/supervisord.conf

# Back to main directory
WORKDIR /app

# Expose required ports
EXPOSE 8000 4416

RUN apt update && apt install -y lsof net-tools iproute2

# Run Supervisor to manage services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
