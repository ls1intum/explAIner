# Use Node.js version 20 with Alpine Linux (lightweight base image)
FROM node:20-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json from local backend/ to container's /app/
COPY package*.json ./

# Install all npm dependencies defined in package.json
RUN npm install

# Copy all remaining files from local backend/ directory to container's /app/
COPY . .

# Generate Prisma Client after copying files
RUN npx prisma generate

# Expose port 3001 so it can be accessed from outside the container
EXPOSE 3001

# Default command to run when container starts (NestJS development mode with hot-reload)
CMD ["npm", "run", "start:dev"]
