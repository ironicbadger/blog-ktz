---
title: Access a Synology NAS with Traefik on DSM7
slug: access-a-synology-nas-with-traefik-on-dsm7
description: |-
  With the recent update to DSM7 my Synology NAS has been transformed. It now runs a recent version of docker, I can use Ansible to manage docker-compose like I do with all my other systems and it now runs systemd!

  I use Traefik as my reverse proxy of choice, I understand it well and use it everywhere across about a dozen hosts - both at home and in the cloud. So it's logical to me to use Traefik to handle reverse proxying and TLS certification with the Synology box I have - the DS1621+.


  Pre-re
customExcerpt: null
publishedAt: 2021-09-01T22:06:43.000-04:00
updatedAt: 2026-05-07T07:21:52.000-04:00
featureImage: /content/images/2021/09/Capture.PNG
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
ghostId: 6775c6279e78ea00017cbc26
tags:
  - synology
  - docker
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: synology
featured: false
readingTime: 4
---

With the recent update to DSM7 my Synology NAS has been transformed. It now runs a recent version of docker, I can use Ansible to manage docker-compose like I do with [all my other systems](https://github.com/IronicBadger/ansible-role-docker-compose-generator?ref=blog.ktz.me) and it now runs systemd!

I use Traefik as my reverse proxy of choice, I understand it well and use it everywhere across about a dozen hosts - both at home and in the cloud. So it's logical to me to use Traefik to handle reverse proxying and TLS certification with the Synology box I have - the [DS1621+](https://www.synology.com/en-us/products/DS1621+?ref=blog.ktz.me).

<h2 id="pre-requisites">Pre-requisites</h2>

This guide assumes that you have your own domain and the DNS for that domain is managed by a [supported DNS provider](https://doc.traefik.io/traefik/v1.7/configuration/acme/?ref=blog.ktz.me) - in my case I use Cloudflare.

Not every Synology NAS will support running docker, if yours doesn't then this guide is not for you.

<h2 id="free-up-your-ports">Free up your ports</h2>

Traefik expects that port `80` and `443` are available for its use so we must ensure that these are available. Typically, DSM likes to grab these but that's not what we want.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/09/image-1.png" class="kg-image" alt="" loading="lazy" width="1341" height="788" srcset="/content/images/size/w600/2021/09/image-1.png 600w, /content/images/size/w1000/2021/09/image-1.png 1000w, /content/images/2021/09/image-1.png 1341w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>Pick a custom port for DSM</figcaption></figure>

The ports you pick aren't important but they must be consistent throughout this entire process. As you can see, I picked `5000` for the HTTP port and `5001` for the HTTPS port. I ticked the box `Automatically redirect HTTP connection to HTTPS for DSM desktop` which makes our life a little later more complicated but ensures that communications are always encrypted which is what we want.

<h2 id="install-docker-and-docker-compose">Install docker and docker-compose</h2>

This is a simple step but an important one. Docker is available as package from Synology and docker-compose has its own [installation docs](https://docs.docker.com/compose/install/?ref=blog.ktz.me) which work fine our purposes.

```shellsession
alex@elrond:~$ docker --version
Docker version 20.10.3, build b455053
alex@elrond:~$ docker-compose --version
docker-compose version 1.28.5, build 324b023a
```
<figcaption class="kg-code-caption">You will need docker and docker-compose installed</figcaption>

<h2 id="directing-traefik">Directing Traefik</h2>

We will use docker-compose to manage our containers. SSH into the Synology and create a file called `docker-compose.yml`, put it in your home folder if you like and using the following contents:

```yaml
---
version: "2"
services:
  traefik:
    image: traefik
    container_name: tr
    volumes:
      - /volume2/appdata/traefik/config:/etc/traefik
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 80:80
      - 443:443
      - 8080:8080
    environment:
      - CLOUDFLARE_EMAIL=1234@gmail.com
      - CLOUDFLARE_API_KEY=1234
    command:
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entryPoint.to=websecure
      - --entrypoints.web.http.redirections.entryPoint.scheme=https
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.cloudflare.acme.dnschallenge=true
      - --certificatesresolvers.cloudflare.acme.dnschallenge.provider=cloudflare
      - --certificatesresolvers.cloudflare.acme.email=1234@gmail.com
    restart: unless-stopped
  nginxtest:
    image: nginx
    container_name: nginxtest
    labels:
      - traefik.enable=true
      - traefik.http.routers.nginxtest.rule=Host(`test.el.gg.ktz.me`)
      - traefik.http.routers.nginxtest.entrypoints=websecure
      - traefik.http.routers.nginxtest.tls.certresolver=cloudflare
    restart: unless-stopped
```

Notice a couple of important things:

-   `CLOUDFLARE_EMAIL` - Cloudflare account email
-   `CLOUDFLARE_API_KEY` - Cloudflare global API key
-   `/volume2/appdata/traefik/config:/etc/traefik` - A location on your NAS where we'll store the TLS certs and a couple of configuration files for Traefik

<h2 id="create-supporting-configuration-files">Create supporting configuration files</h2>

Ensure that the config directory exists (`/volume2/appdata/traefik/config` above) and place two files into it.

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
    file:
      filename: /etc/traefik/rules.yaml
log:
    level: info
certificatesResolvers:
    cloudflare:
        acme:
            email: 1234@gmail.com
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
<figcaption class="kg-code-caption">traefik.yaml</figcaption>

```yaml
http:
  routers:
    router-dsm:
      entryPoints:
        - websecure
      rule: "Host(`dsm.el.gg.ktz.me`)"
      service: service-dsm
      tls:
        certResolver: cloudflare
  services:
    service-dsm:
      loadBalancer:
        passHostHeader: true
        servers:
        - url: "https://192.168.1.11:5001"
```
<figcaption class="kg-code-caption">rules.yaml</figcaption>

Of note, is the `serversTransport: insecureSkipVerify: true`, this tells Traefik to ignore that the self-signed cert generated by the NAS out of the box is insecure. Remember when I said checking the redirect HTTP to HTTPS box would cause us problems later? This is that moment.

<h2 id="configure-dns">Configure DNS</h2>

For the purposes of this guide we should assume you are familiar with the basics of DNS, however we'll need to make sure that you have created a record which points your chosen domain to the IP of your NAS.

I would suggest not exposing the NAS directly to the internet and instead run a VPN on your LAN and use a local DNS server to host this record - but that's getting a bit beyond the scope of this post. In my case I run AdGuard Home on a Pi locally and created a wildcard record pointing `*.el.gg.ktz.me` at the IP of the Synology NAS `192.168.1.11`. Remote access in my case is handled using [Tailscale](https://tailscale.com/?ref=blog.ktz.me).

We can verify successful DNS record creation using `nslookup` like so:

```bash
alex@elrond:~$ nslookup dsm.el.gg.ktz.me
Server:         192.168.1.254
Address:        192.168.1.254#53

Non-authoritative answer:
Name:   dsm.el.gg.ktz.me
Address: 192.168.1.11
```

<h2 id="bring-it-all-up">Bring it all up</h2>

With all of that done, we should be in a position to start Traefik. We can do this with `docker-compose up -d` and monitor the progress with `docker-compose -f logs`.

Notice in my example compose file above I added a simple `nginxtest` container which should help you verify the TLS generation and DNS challenge stuff is all working as expected.

Assuming everything went as planned, you should now be able to browse to your Synology DSM interface via the domain configured in Traefik.

I hope this post helped you out. For help and support you can find me on the Self-Hosted podcast [Discord server](https://discord.com/invite/n49fgkp?ref=blog.ktz.me) @alexktz.

<iframe src="https://player.fireside.fm/v2/dUlrHQih+mqPqIiGL?theme=dark" width="740" height="200" frameborder="0" scrolling="no" loading="lazy" title="Embedded media"></iframe>
