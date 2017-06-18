How to create Docker

1. Copy Dockerfile (it sets all the paths)
2. Add .dockerignore (we don't want to share node_modules, logs nor mozzarelle)
3. Build the image `docker build -t <your username>/node-web-app .` (eg riccardosibani/aec-5) [Mind The DOT]
4. You can check your image with `docker images`
5. How to run it? Simple: `docker run  -it --rm riccardosibani/aec-5 node --version`
