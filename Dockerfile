# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

ARG PUBLIC_ASSET_BASE_URL=""
ENV PUBLIC_ASSET_BASE_URL=${PUBLIC_ASSET_BASE_URL}

RUN npm run build


FROM nginx:1.28-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/site.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist/ /usr/share/nginx/html/

RUN mkdir -p /usr/share/nginx/html/content \
	&& chown nginx:nginx /usr/share/nginx/html/content

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
	CMD wget -q -O /dev/null http://127.0.0.1:8080/_healthz || exit 1

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

