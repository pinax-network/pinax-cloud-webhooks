FROM oven/bun

WORKDIR /app

ENV PUBLIC_KEY $PUBLIC_KEY
ENV PORT $PORT

COPY bun.lockb ./

COPY . .

RUN bun install

CMD [ "bun", "http.ts" ]
