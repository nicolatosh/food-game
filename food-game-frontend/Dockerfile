FROM node:15.8.0-alpine
WORKDIR /food-game-frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD [ "npm", "start" ]