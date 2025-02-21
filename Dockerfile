FROM registry.cn-shanghai.aliyuncs.com/fisschl/deno:latest
WORKDIR /root
COPY deno.json .
COPY deno.lock .
RUN deno install
COPY . .
CMD deno run --allow-all app.ts
