FROM node:lts

ARG GOOGLE_API_KEY
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

WORKDIR /app-frontend

COPY . ./

RUN npm install

RUN npm run build

EXPOSE 80

CMD [ "npm", "run", "preview" ]