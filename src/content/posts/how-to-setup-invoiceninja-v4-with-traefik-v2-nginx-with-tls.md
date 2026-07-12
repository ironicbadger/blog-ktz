---
title: How to setup InvoiceNinja v4 with Traefik v2 + nginx with TLS
slug: how-to-setup-invoiceninja-v4-with-traefik-v2-nginx-with-tls
description: As you may know I'm the sort of chap who runs everything I possibly can using containers. However, setting up a Self-Hosted InvoiceNinja with a reverse proxy - Traefik in this case - wasn't the easiest thing ever. Here's how I did it.
customExcerpt: As you may know I'm the sort of chap who runs everything I possibly can using containers. However, setting up a Self-Hosted InvoiceNinja with a reverse proxy - Traefik in this case - wasn't the easiest thing ever. Here's how I did it.
publishedAt: 2020-09-14T16:50:04.000-04:00
updatedAt: 2026-05-07T07:22:01.000-04:00
featureImage: https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
featureImageAlt: null
featureImageCaption: null
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 6775c6279e78ea00017cbc15
tags:
  - technical
  - traefik
  - reverse-proxy
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 3
---

[InvoiceNinja](https://www.invoiceninja.com/?ref=blog.ktz.me) is a great tool to manage clients, invoices and track all sorts of stuff related to you getting paid!

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/09/alt4-devices.png" class="kg-image" alt="" loading="lazy" width="1323" height="761" srcset="/content/images/size/w600/2020/09/alt4-devices.png 600w, /content/images/size/w1000/2020/09/alt4-devices.png 1000w, /content/images/2020/09/alt4-devices.png 1323w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

As you may know I'm the sort of chap who runs *everything I possibly can* using containers. However, setting up a Self-Hosted InvoiceNinja with a reverse proxy - [Traefik](https://containo.us/traefik/?ref=blog.ktz.me) in this case - wasn't the easiest thing ever. Here's how I did it.

<h2 id="lots-of-files">Lots of files</h2>

You will need to run 3 different containers (4 if you include Traefik). This is because InvoiceNinja doesn't ship with either a built-in database or web server, no big deal in container land though, we'll just spin those up using compose.

Quite a few moving pieces to this one. We have:

-   `docker-compose.yaml` - defines the 4 containers required
-   `traefik.yaml` - configures traefik
-   `ninja.conf` - to configure nginx

For the purposes of this example we'll use `invoiceninja.123.me` as our target domain to be secured with TLS via Traefik. Note that I am using the DNS validation method with Cloudflare for the domain `123.me`, this requires your Cloudflare API key - setting this up is a whole 'nother article though.

Here's the full `docker-compose.yaml` file needed for all 4 containers.

```yaml
---
version: "2"
services:
  traefik:
    image: traefik
    container_name: traefik
    volumes:
      - /mnt/tank/appdata/traefik:/etc/traefik
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 80:80
      - 443:443
      - 8080:8080
    environment:
      - CLOUDFLARE_EMAIL=123@gmail.com
      - CLOUDFLARE_API_KEY=123
    restart: unless-stopped
  mysql:
    image: mariadb
    container_name: mysql
    volumes:
      - /mnt/tank/appdata/mysql:/var/lib/mysql
    ports:
      - 3306:3306
    environment:
      - MYSQL_ROOT_PASSWORD=123
      - MYSQL_PASSWORD=123
      - MYSQL_DATABASE=ninja
      - MYSQL_USER=ninja
    restart: unless-stopped
  ninja_nginx:
    image: nginx
    container_name: ninja_nginx
    volumes:
      - /mnt/tank/appdata/invoiceninja/ninja.conf:/etc/nginx/conf.d/default.conf:ro
      - /mnt/tank/appdata/invoiceninja/storage:/var/www/app/storage
      - /mnt/tank/appdata/invoiceninja/public/logo:/var/www/app/logo
      - /mnt/tank/appdata/invoiceninja/public:/var/www/app/public
    labels:
      - traefik.enable=true
      - traefik.http.routers.nginx.rule=Host(`invoiceninja.123.me`)
      - traefik.http.routers.nginx.entrypoints=websecure
      - traefik.http.routers.nginx.tls.certresolver=cloudflare
      - traefik.http.services.nginx.loadbalancer.server.port=80
    restart: unless-stopped
  invoiceninja:
    image: invoiceninja/invoiceninja:4.5.18
    container_name: invoiceninja
    volumes:
      - /mnt/tank/appdata/invoiceninja/storage:/var/www/app/storage
      - /mnt/tank/appdata/invoiceninja/public/logo:/var/www/app/logo
      - /mnt/tank/appdata/invoiceninja/public:/var/www/app/public
    environment:
      - MYSQL_DATABASE=ninja
      - MYSQL_ROOT_PASSWORD=123
      - APP_DEBUG=0
      - APP_URL=https://invoiceninja.123.me
      - APP_KEY=base64:123
      - APP_CIPHER=AES-256-CBC
      - DB_USERNAME=ninja
      - DB_PASSWORD=123
      - DB_HOST=mysql
      - DB_DATABASE=ninja
      - MAIL_HOST=smtp.gmail.com
      - MAIL_USERNAME=123@gmail.com
      - MAIL_PASSWORD=123
      - MAIL_DRIVER=smtp
      - MAIL_FROM_NAME="Alex"
      - MAIL_FROM_ADDRESS=123@gmail.com
      - REQUIRE_HTTPS=true
      - TRUSTED_PROXIES='*'
    depends_on:
      - mysql
    restart: unless-stopped
```

This particular method of deploying Traefik requires a config file to be mounted from a volume at `/etc/traefik/traefik.yaml`. Here is that file:

```yaml
entryPoints:
    web:
        address: :80
        http:
          redirections:
            entryPoint:
              to: websecure
              scheme: https
    websecure:
        address: :443
    traefik:
        address: ":8080"
ping: {}
providers:
    docker:
        endpoint: unix:///var/run/docker.sock
        watch: true
        exposedByDefault: false
api:
    dashboard: true
    insecure: true
log:
    level: debug
certificatesResolvers:
    cloudflare:
        acme:
            email: 123@gmail.com
            storage: /etc/traefik/acme.json
            dnsChallenge:
                provider: cloudflare
                delayBeforeCheck: 0
                resolvers:
                - 1.1.1.1:53
                - 1.0.0.1:53
serversTransport:
    insecureSkipVerify: true
```

The final piece of the jigsaw in the nginx configuration file which is mounted again using a volume into the nginx container at `/etc/nginx/conf.d/default.conf`. Here is that file:

```nginx
server {
    listen 80 default_server;
    server_name invoiceninja.*;

    root /var/www/app/public/;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Handle PHP Applications
    location ~ \.php$ {
        set $upstream_invoiceninja invoiceninja:9000;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass $upstream_invoiceninja;
        fastcgi_index index.php;
        include /etc/nginx/fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_param HTTPS 1;
        resolver 127.0.0.11 valid=30s;
    }
}
```
