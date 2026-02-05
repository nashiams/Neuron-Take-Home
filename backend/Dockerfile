FROM node:20

WORKDIR /app

RUN npm install -g sequelize-cli

COPY package*.json ./

RUN npm install

# Copy and fix the entrypoint script BEFORE copying all files
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN apt-get update && apt-get install -y dos2unix postgresql-client && \
    dos2unix /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]