FROM oven/bun:1.1.13

WORKDIR /app

COPY bun.lockb package.json ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["bun", "start"]