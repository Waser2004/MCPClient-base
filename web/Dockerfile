# Use a lightweight Node.js image
FROM node:24-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port your app runs on (default for create-react-app is 3000)
EXPOSE 3000

# Start in development mode
CMD ["npm", "start"]
