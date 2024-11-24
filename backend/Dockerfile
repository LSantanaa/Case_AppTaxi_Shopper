FROM node:lts

WORKDIR /app-backend

COPY package*.json ./
COPY prisma ./

RUN npm install

EXPOSE 8080

CMD [ "npx","prisma","migrate","dev","npx","prisma","generate","npm", "run", "dev" ]