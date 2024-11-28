FROM node:lts

WORKDIR /app-frontend

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 80

CMD [ "npm", "run", "preview" ]