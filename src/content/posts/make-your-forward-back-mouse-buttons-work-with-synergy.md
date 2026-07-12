---
title: Make your forward / back Mouse Buttons work with Synergy
slug: make-your-forward-back-mouse-buttons-work-with-synergy
description: Synergy is an application I use to share my keyboard and between a VFIO guest and host system. One thing has bugged me about it for ages but today I found a solution that...
customExcerpt: Synergy is an application I use to share my keyboard and between a VFIO guest and host system. One thing has bugged me about it for ages but today I found a solution that...
publishedAt: 2019-09-15T00:22:48.000-04:00
updatedAt: 2026-05-07T07:22:46.000-04:00
featureImage: /content/images/2019/09/mouse--1-.jpg
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
ghostId: 6775c6279e78ea00017cbbf3
tags:
  - linux
  - vfio
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: linux
featured: false
readingTime: 1
---

Synergy is an application I use to share my keyboard and between a VFIO guest and host system. One thing has bugged me about it for ages but today I found a solution that...

<figure class="kg-card kg-image-card"><img src="/content/images/2019/09/image.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

By first exporting your config and then selecting the `use existing configuration` section you're able to add a couple of *key* lines to the synergy config which aren't exposed via the UI.

```
section: options
        mousebutton(6) = keystroke(WWWBack)
        mousebutton(7) = keystroke(WWWForward)
end
```

There's probably a bunch of other stuff in the options section but by adding `keystroke()` we're able to finally use the forward / back mouse buttons in a Synergy client!
