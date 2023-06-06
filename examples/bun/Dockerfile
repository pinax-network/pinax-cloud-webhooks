FROM oven/bun

WORKDIR /app

ENV PUBLIC_KEY $PUBLIC_KEY
ENV PORT $PORT

COPY . .

CMD [ "bun", "http.ts" ]
