FROM node:lts

WORKDIR /app-backend

COPY package*.json ./

RUN npm install

EXPOSE 8080

CMD [ "npm", "run", "dev" ]