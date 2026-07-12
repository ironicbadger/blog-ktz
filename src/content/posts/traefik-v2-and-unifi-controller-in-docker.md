---
title: Traefik v2 and Unifi Controller in docker
slug: traefik-v2-and-unifi-controller-in-docker
description: Due to the fact that Unifi runs on port 8443 inside the container and expects TLS a couple of extra parameters were required. Here's the relevant docker-compose snippet.
customExcerpt: Due to the fact that Unifi runs on port 8443 inside the container and expects TLS a couple of extra parameters were required. Here's the relevant docker-compose snippet.
publishedAt: 2020-09-23T10:03:19.000-04:00
updatedAt: 2026-05-07T07:22:00.000-04:00
featureImage: https://images.unsplash.com/photo-1465447142348-e9952c393450?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc16
tags:
  - technical
  - unifi
  - docker
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

As my migration to Traefik v2 continues I am finding a few apps that need a little extra TLC to make work, in this case the Unifi controller software.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/09/image.png" class="kg-image" alt="" loading="lazy" width="1574" height="1048" srcset="/content/images/size/w600/2020/09/image.png 600w, /content/images/size/w1000/2020/09/image.png 1000w, /content/images/2020/09/image.png 1574w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

Due to the fact that Unifi runs on port `8443` inside the container and expects TLS a couple of extra parameters were required. Here's the relevant `docker-compose` snippet.

> As always, you can find full example code at [github.com/ironicbadger/infra](https://github.com/ironicbadger/infra?ref=blog.ktz.me).

```yaml

---
version: "2"
services:
  traefik:
    image: traefik
    container_name: tr
    volumes:
      - /opt/appdata/traefik:/etc/traefik
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 80:80
      - 443:443
    environment:
      - CLOUDFLARE_EMAIL=123@gmail.com
      - CLOUDFLARE_API_KEY=123
    restart: unless-stopped
  unifi:
    image: linuxserver/unifi-controller
    container_name: unifi
    volumes:
      - /opt/appdata/unifi:/config
    labels:
      - traefik.enable=true
      - traefik.http.routers.ubiq.rule=Host(`unifi.123.cloud`)
      - traefik.http.routers.ubiq.entrypoints=websecure
      - traefik.http.routers.ubiq.tls=true
      - traefik.http.routers.ubiq.tls.certresolver=cloudflare
      - traefik.http.services.ubiq.loadbalancer.server.scheme=https
      - traefik.http.services.ubiq.loadbalancer.server.port=8443
    ports:
      - 8080:8080
      - 3478:3478/udp
    environment:
      - PUID=1313
      - PGID=1313
      - TZ=America/New_York
    restart: unless-stopped
```

In particular, the two magic lines of additional configuration were:

```yaml
- traefik.http.routers.ubiq.tls=true
- traefik.http.services.ubiq.loadbalancer.server.scheme=https
```

For configuration of Traefik itself I use a config file instead of labels, that is available [here](https://github.com/IronicBadger/infra/blob/master/files/traefik/traefik.yaml?ref=blog.ktz.me). Note that for Unifi, because it is over https on `8443`, we will need to add a couple of lines to the configuration in `traefik.yaml`

```yaml
serversTransport:
    insecureSkipVerify: true
```

Once you have those 4 lines of configuration added, you're good to go. That's it.

Traefik is just so straightforward, it is amazing and I love it! If there's one thing I wish it did better it would be logging. At present it is too opaque and debugging errors like these is like solving the DaVinci code!
