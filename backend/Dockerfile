# Use a lightweight Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]