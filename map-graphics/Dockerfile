# In your Dockerfile.
FROM node:10.7.0

# Dockerfile author / maintainer
MAINTAINER Huy Nguyen <huyvnn@yahoo.com>

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Copy all local files into the image.
COPY . .

# CHeck info
RUN ls -al

# Build project
ENTRYPOINT webpack --config webpack.config.js

# Run it
CMD node ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --port 8080 --host 0.0.0.0 --config webpack.config.js