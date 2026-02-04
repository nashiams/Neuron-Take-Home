FROM node:18

WORKDIR /app

# Install sequelize-cli globally
RUN npm install -g sequelize-cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

EXPOSE 3000

# Use npm start which should run migrations then start server
CMD ["npm", "start"]