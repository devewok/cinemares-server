# Dockerfile
FROM node

WORKDIR .

COPY . .

RUN npm install

EXPOSE 3500
CMD npm run begin
