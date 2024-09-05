# Stage 1: Build Stage
FROM node:18 AS build

WORKDIR /usr/src/app

# Install necessary tools
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies based on package.json
# RUN npm set-script prepare "" && npm install --omit=dev

# Rebuild bcrypt to ensure it's compiled correctly for the container environment
# RUN npm rebuild bcrypt@5.1.0 --build-from-source

# Stage 2: Production Stage
FROM node:18

WORKDIR /usr/src/app

# Copy only node_modules from the build stage
# COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

RUN npm install
# Install any additional global dependencies (if needed)
RUN npm install -g nodemon mongoose

EXPOSE 4000

# Start the application using the start script defined in package.json
CMD ["npm", "start"]
