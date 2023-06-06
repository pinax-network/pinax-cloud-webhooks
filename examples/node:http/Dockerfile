FROM node:alpine

WORKDIR /app

ENV PUBLIC_KEY $PUBLIC_KEY
ENV PORT $PORT

COPY package*.json ./

COPY . .

RUN npm ci

CMD [ "node", "http.js" ]
