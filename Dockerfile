FROM registry.cn-shanghai.aliyuncs.com/fisschl/bun:latest
WORKDIR /root
COPY package.json .
COPY bun.lock .
RUN bun install --production
COPY prisma prisma
RUN bun run prisma generate
COPY . .
CMD bun src/index.ts
