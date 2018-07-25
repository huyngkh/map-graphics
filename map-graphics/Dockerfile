# In your Dockerfile.
FROM node:latest

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