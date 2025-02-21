FROM registry.cn-shanghai.aliyuncs.com/fisschl/deno:latest AS builder

WORKDIR /root

COPY deno.json .
COPY deno.lock .

RUN deno install

COPY . .

RUN deno compile --allow-all --output app app.ts

FROM registry.cn-shanghai.aliyuncs.com/fisschl/deno:latest

WORKDIR /root

COPY --from=builder /root/app .

CMD ./app
