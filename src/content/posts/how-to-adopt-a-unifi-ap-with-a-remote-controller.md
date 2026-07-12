---
title: How to adopt a Unifi AP with a remote controller
slug: how-to-adopt-a-unifi-ap-with-a-remote-controller
description: |-
  A fresh out of the box Unifi Access Point has no idea what to do with itself. It starts scanning the local LAN for any controllers to 'announce' that it is here and needs configuration. But what about when your controller isn't on the LAN? Mine is running on a DigitalOcean droplet, for example.

  We need to tell the AP where the controller resides in order for the announcement to be successful. It's actually a relatively straightforward thing to solve but requires a few steps which I'll outline b
customExcerpt: null
publishedAt: 2020-03-12T16:00:00.000-04:00
updatedAt: 2026-05-07T07:22:37.000-04:00
featureImage: https://images.unsplash.com/photo-1537151331551-0551b27d1b99?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc04
tags:
  - unifi
  - technical
  - networking
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: unifi
featured: false
readingTime: 1
---

A fresh out of the box Unifi Access Point has no idea what to do with itself. It starts scanning the local LAN for any controllers to 'announce' that it is here and needs configuration. But what about when your controller isn't on the LAN? Mine is running on a DigitalOcean droplet, for example.

We need to tell the AP where the controller resides in order for the announcement to be successful. It's actually a relatively straightforward thing to solve but requires a few steps which I'll outline below.

First, power up your AP and find its IP address. Then use SSH to connect to the AP, the default user and password is `ubnt`.

You'll then need your 'inform-url' which will look something like [`http://192.168.0.8:8080/inform`](http://192.168.0.8:8080/inform?ref=blog.ktz.me). Tell your AP where it can find the controller by running:

```bash
# set-inform http://unifi.ktz.domain:8080/inform
```

Once you've done this, the AP should show up almost immediately in the interface of your Unifi controller saying 'pending adoption'.

Adopt the AP and enjoy the rest of your day. Configuration for the site will be automatically applied.

<h2 id="post-adoption-ssh-note">Post Adoption SSH note</h2>

Note that after adoption the SSH password will be changed from `ubnt/ubnt`. You can modify the post adoption Unifi SSH username and password in the controller software by enabling 'advanced features' and then configuring your desired credentials under `Site -> Device Authentication`.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/03/image-1.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

And that should be that!
