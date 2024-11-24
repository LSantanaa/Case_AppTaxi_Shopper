FROM node:lts

WORKDIR /app-backend

COPY package*.json ./
COPY prisma ./

RUN run build

EXPOSE 8080

CMD [ "node","dist/server.js"]