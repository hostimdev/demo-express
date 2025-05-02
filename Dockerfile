# Use the official Node.js image
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy dependencies first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Expose port (default Express port)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
