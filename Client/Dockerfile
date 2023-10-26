FROM node:18.18.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Expose the port on which your React application runs
EXPOSE 5173

# Define the command to start your React application
CMD ["npm", "run", "dev"]