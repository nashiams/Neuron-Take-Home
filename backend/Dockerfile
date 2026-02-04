FROM node:18

WORKDIR /app

RUN npm install -g sequelize-cli

COPY package*.json ./

# Remove --omit=dev to include devDependencies needed for bcrypt compilation
RUN npm install

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]