# Use an official Node.js runtime as a parent image
FROM node:12

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle your app source
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "app.js"]
