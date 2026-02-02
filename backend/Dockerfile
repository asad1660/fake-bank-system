FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build NestJS
RUN npm run build

# Expose backend port
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]
