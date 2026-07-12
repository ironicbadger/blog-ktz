---
title: Monolithic docker-compose files filtered with profiles
slug: monolithic-docker-compose-files-filtered-by-labels
description: |-
  Those of us who use docker-compose to manage our fleets of containers generally fall into two camps. Camp A prefers one monolithic docker-compose file per host using docker-compose <command> <service> to interact with each service. Camp B split up their configuration into multiple files with some kind of logical grouping which makes sense to them.

  This post will provide an overview of using profiles with docker-compose to address multiple services within a monolithic file. This aims to provide 
customExcerpt: null
publishedAt: 2021-10-29T20:55:34.000-04:00
updatedAt: 2026-05-07T07:21:51.000-04:00
featureImage: https://images.unsplash.com/photo-1514927298007-a2b56e5270e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE3fHxmaWx0ZXJ8ZW58MHx8fHwxNjM1NTU1MzA5&ixlib=rb-1.2.1&q=80&w=2000
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
ghostId: 6775c6279e78ea00017cbc27
tags:
  - docker
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: docker
featured: false
readingTime: 1
---

Those of us who use docker-compose to manage our fleets of containers generally fall into two camps. Camp A prefers one monolithic docker-compose file per host using `docker-compose <command> <service>` to interact with each service. Camp B split up their configuration into multiple files with some kind of logical grouping which makes sense to them.

This post will provide an overview of using profiles with docker-compose to address multiple services within a monolithic file. This aims to provide all the advantages of Camp B's approach without the faff and hassle of changing directories or managing multiple compose files.

<h2 id="example-a">Example A</h2>

Take the following compose file:

```yaml
version: "3.3"
services:
  nginx1:
    image: nginx
    container_name: nginx1
    profiles: 
      - prod
      - test
  nginx2:
    image: nginx
    container_name: nginx2
    profiles: 
      - prod
  nginx3:
    image: nginx
    container_name: nginx3
    profiles: 
      - test
```

Using the profiles it's possible to put a single service into more than profile at once giving much more flexibility than multiple files as Camp B would typically do.

```shellsession
alex@slartibartfast tmp % docker-compose --profile test up -d
[+] Running 2/2
 ⠿ Container nginx3  Started  0.5s
 ⠿ Container nginx1  Started
 
```

As you can see above `nginx1` and `nginx3` were both started because they are members of the profile `test`. Profiles support all operations that you'd expect via compose and the full documentation can be found over in Docker's [documentation](https://docs.docker.com/compose/profiles/?ref=blog.ktz.me).

Note that if you include a profile a simple `docker-compose up -d` will fail:

```shellsession
alex@slartibartfast tmp % docker-compose up -d
no service selected
```

These profiles aren't perfect and certainly have nuances you will need to become familiar with but they are quite promisingly useful.

<h2 id="conclusion">Conclusion</h2>

A relatively short post this but after a discussion on the [Self-Hosted discord](https://selfhosted.show/discord?ref=blog.ktz.me) server earlier the topic of monolith vs multiple smaller files came up. It occurred to me there must be a way to filter containers and this is what I found.  

Hope you found this useful. Let me know if you use this in the real world!
