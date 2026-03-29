# Use Node 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy rest of the code
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]