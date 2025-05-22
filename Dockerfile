FROM node:22.4.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the app for production
RUN npm run build

# Expose port 8080 for the web server
EXPOSE 8080

# Run Node
CMD ["node", "./dist/index.js"]