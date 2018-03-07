FROM node:carbon-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Copy the rest of the project
COPY . .

EXPOSE 4200
CMD [ "npm", "start" ]
