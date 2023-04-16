# Mellow
Web music player and not only

## Development

Run development server:  
`yarn serve:dev`

It is using webpack-dev-server which has built-in Hot Module Replacement - *It might not work when running server in WSL (windows subsystem for linux)*

### Using Docker

Create image of the app:  
`docker build -t mellov-web --no-cache .`

Create volume for **node_modules** to isolate them from binding:  
`docker volume create --name mellov_node_modules`

Run docker container:  
``docker run --name mellov-web-cntr -p 8080:8080 -v `pwd`:/app -v mellov_node_modules:/app/node_modules -d mellov-web``
