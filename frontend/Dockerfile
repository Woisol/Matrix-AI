FROM node:22-alpine

ENV CHOKIDAR_USEPOLLING=true

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
# COPY 了依然找不到……暂时忽略 script 安装
COPY scripts ./
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run postinstall || true

EXPOSE 4200

CMD ["pnpm", "start", "--host", "0.0.0.0", "--proxy-config", "proxy.docker.conf.json"]
