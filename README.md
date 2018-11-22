# Event Store

## Getting started with docker compose
```
git clone https://github.com/oskarssylwan/event-store.git
cd event-store
docker-compose up
```

## Without docker
```
git clone https://github.com/oskarssylwan/event-store.git
cd event-store
npm install
npm copy-env
npm start
```
The application will try to connect to the default mongodb port on localhost. To change mongo address edit the .env file.

## Environment variables
Environment and configuration variables are specified in a .env file in the root project directory. When starting the application with docker the variables in .default.env vill be used. To run the project without docker copy the contents from .default.env to a new .env file before running npm start.

## Sending commands (obsolete)
Event store will by default listen on port 3000 for incoming requests. Use this port to send commands with a POST request.

## Subscribing to new events
Subscribers can connect to a TCP server on port 3001 and will be sent any new events created as a result of incoming commands.
