FROM node:20-alpine

WORKDIR /app

ENV PUBLIC_KEY $PUBLIC_KEY
ENV PORT $PORT

COPY . .

RUN npm ci

CMD [ "node", "http.js" ]
