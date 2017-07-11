FROM node:7.1-slim

# Create app directory
RUN mkdir -p /myapp/src
WORKDIR /myapp

RUN mkdir /myapp/rpc-data



# Install app dependencies
ADD build /myapp/
ADD client /myapp/
ADD models /myapp/
ADD resources /myapp/
ADD src /myapp/
RUN npm install -g ethereumjs-testrpc@4.0.0
RUN npm install

#CMD testrpc &

# Add app source
ADD src /myapp/src

EXPOSE 8080
CMD [ "sh", "entry_point.sh" ]