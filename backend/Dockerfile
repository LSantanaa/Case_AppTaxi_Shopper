FROM node:lts

WORKDIR /app-backend

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 8080

CMD [ "node", "dist/server.js" ]