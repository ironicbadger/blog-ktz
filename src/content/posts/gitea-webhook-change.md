---
title: Gitea Webhook Change
slug: gitea-webhook-change
description: |-
  A while back I wrote about deploying DroneCI and Gitea together to build projects automatically. A few months ago my CI broke and I've only just now gotten around to fixing it.

  In PR #17482 the Gitea project introduced a breaking change for security reasons. They introduced a new webhook.ALLOWED_HOST_LIST value which needed to be configured in order for webhooks to work.


  Diagnosis

  In Gitea open the repo in question and navigate to the repo specific settings -> webhooks.

  Next utilise the rec
customExcerpt: null
publishedAt: 2022-06-01T10:34:08.000-04:00
updatedAt: 2026-05-07T07:21:49.000-04:00
featureImage: https://images.unsplash.com/photo-1627232826792-c5e753b1e985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDYyfHxob29rfGVufDB8fHx8MTY1NDA5NDAzNw&ixlib=rb-1.2.1&q=80&w=2000
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
ghostId: 6775c6279e78ea00017cbc2a
tags:
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 1
---

A while back I wrote about deploying DroneCI and Gitea together to build projects automatically. A few months ago my CI broke and I've only just now gotten around to fixing it.

In PR [#17482](https://blog.gitea.io/2022/02/gitea-1.16.0-and-1.16.1-released/?ref=blog.ktz.me#-only-allow-webhook-to-send-requests-to-allowed-hosts-17482httpsgithubcomgo-giteagiteapull17482) the Gitea project introduced a breaking change for security reasons. They introduced a new `webhook.ALLOWED_HOST_LIST` value which needed to be configured in order for webhooks to work.

<h2 id="diagnosis">Diagnosis</h2>

In Gitea open the repo in question and navigate to the repo specific settings -> webhooks.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2022/06/image.png" class="kg-image" alt="" loading="lazy" width="1198" height="272" srcset="/content/images/size/w600/2022/06/image.png 600w, /content/images/size/w1000/2022/06/image.png 1000w, /content/images/2022/06/image.png 1198w" decoding="async"></figure>

Next utilise the recent deliveries history at the bottom to determine your failure scenario.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2022/06/image-1.png" class="kg-image" alt="" loading="lazy" width="1193" height="336" srcset="/content/images/size/w600/2022/06/image-1.png 600w, /content/images/size/w1000/2022/06/image-1.png 1000w, /content/images/2022/06/image-1.png 1193w" decoding="async"></figure>

Mine stated:

```
Delivery: Post "https://drone.123.com/hook?secret=HMKLFV47c1kJ78QyVez6RHcxPJAHI6TB": dial tcp 192.168.1.10:443: webhook can only call allowed HTTP servers (check your webhook.ALLOWED_HOST_LIST setting), deny 'drone.123.com(192.168.1.10:443)'
```

<h2 id="fixing-it">Fixing it</h2>

The fix was quite straightforward. Modify the `app.ini` file which contains your Gitea config and add:

```ini
[webhook]
ALLOWED_HOST_LIST = drone.123.com, 192.168.x.x/24
```

Add as many hosts as is required. Restart Gitea and you'll once more have working webhooks.
