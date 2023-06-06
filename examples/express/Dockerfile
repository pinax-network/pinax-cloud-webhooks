FROM bitnami/express

WORKDIR /app

ENV PUBLIC_KEY $PUBLIC_KEY
ENV PORT $PORT

COPY . .

RUN npm install --save-dev tsx

CMD [ "npx", "tsx", "http.ts" ]

