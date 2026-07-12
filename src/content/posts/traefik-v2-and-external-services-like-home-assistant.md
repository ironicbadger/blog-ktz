---
title: Traefik v2 and external services like Home Assistant and Blue Iris
slug: traefik-v2-and-external-services-like-home-assistant
description: |-
  I recently made the switch from the nginx reverse proxy life to Traefik. I've written a couple of other posts recently about the process:

   * Running Unifi controller behind Traefik
   * Running InvoiceNinja behind Traefik

  Today's post is going to cover the final piece of the jigsaw I needed to solve before I could dump nginx, the file provider. In otherwords - how do I use Traefik to route traffic for services that aren't containers or published via another service discovery backend? In the case
customExcerpt: null
publishedAt: 2020-09-24T14:11:02.000-04:00
updatedAt: 2026-05-07T07:22:00.000-04:00
featureImage: https://images.unsplash.com/photo-1584649525122-8d6895492a5d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc17
tags:
  - traefik
  - docker
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: traefik
featured: false
readingTime: 2
---

I recently made the switch from the nginx reverse proxy life to [Traefik](https://traefik.io/?ref=blog.ktz.me). I've written a couple of other posts recently about the process:

-   [Running Unifi controller behind Traefik](/traefik-v2-and-unifi-controller-in-docker/)
-   [Running InvoiceNinja behind Traefik](/how-to-setup-invoiceninja-v4-with-traefik-v2-nginx-with-tls/)

Today's post is going to cover the final piece of the jigsaw I needed to solve before I could dump nginx, the file provider. In otherwords - how do I use Traefik to route traffic for services that aren't containers or published via another service discovery backend? In the case of this post it's Home Assistant and Blue Iris. Two critical services in my LAN that run on dedicated hardware.

> As always, code can be found at [github.com/ironicbadger/infra](https://github.com/ironicbadger/infra?ref=blog.ktz.me).

<h2 id="file-provider">File Provider</h2>

Traefik discourage use of the file provider, a quick google on the topc and you'll discover they think it is orthogonal to overall goals of the project. As such, the documentation is a little crypic so here's how I use it.

When I run Traefik I mount `/etc/traefik` to a volume on the host. In that volume create a file called `rules.yaml`. Here is what that file looks like:

```yaml
http:
  routers:
    router-homeassistant:
      entryPoints:
        - websecure
      rule: Host(`ha.123.com`)
      service: service-homeassistant
      tls:
        certResolver: cloudflare
    router-blueiris:
      entryPoints:
        - websecure
      rule: Host(`bi.123.com`)
      service: service-blueiris
      tls:
        certResolver: cloudflare
  services:
    service-homeassistant:
      loadBalancer:
        servers:
        - url: "http://192.168.1.99:8123"
    service-blueiris:
      loadBalancer:
        servers:
        - url: "http://192.168.1.200:81"
```

This file defines routers and services, terms you should be familiar with when working with Traefik.

<div class="postit postit-warning">This file is case sensitive. I lost most of an afternoon because <code>certresolver</code> is not the same as <code>certResolver</code> and so on.</div>

The syntax for defining the rules to match is the same here as it would be if you were applying the label ``http.routers.routername.rule=Host(`bi.ktz.me`)``. This is how to determine the structure of the keys in this file.

<h2 id="-etc-traefik-yaml">/etc/traefik.yaml</h2>

Finally, you'll need to tell Traefik to use this file in `/etc/traefik.yaml`. This is configured under the `providers` key:

```yaml
providers:
    docker:
        endpoint: unix:///var/run/docker.sock
        watch: true
        exposedByDefault: false
    file:
      filename: /etc/traefik/rules.yaml
```

And there we are, that's how to configure an external service to work with Traefik v2.
