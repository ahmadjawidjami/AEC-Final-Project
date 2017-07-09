FROM node:7.1-slim

# Create app directory
RUN mkdir -p /myapp/src
WORKDIR /myapp

# Install app dependencies
ADD . /myapp/
RUN npm install -g ethereumjs-testrpc@4.0.0
RUN npm install

#RUN nohup testrpc &

# Add app source
ADD src /myapp/src

EXPOSE 8080
CMD [ "npm", "start" ]