# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Make port available to the world outside this container
EXPOSE 4000

# Define environment variable
ENV NODE_ENV production

# Run the app when the container launches
CMD ["node", "src/server.js"]
