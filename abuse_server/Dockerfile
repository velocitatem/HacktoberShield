FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json .
RUN npm install

# Copy source code
COPY . .

# Run the app
CMD ["node", "server.js"]
